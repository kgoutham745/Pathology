import Report from '../models/Report.js';
import Patient from '../models/Patient.js';
import TestTemplate from '../models/TestTemplate.js';
import Account from '../models/Account.js';
import { generateReportId } from '../utils/helpers.js';
import { evaluateAccountAccess, getAccountUsage } from '../utils/license.js';

const getAbnormalStatus = (value, normalRange) => {
  const status = { isAbnormal: false, abnormalType: 'normal' };

  if (value === '' || value === null || value === undefined || Number.isNaN(value) || !normalRange) {
    return status;
  }

  const ranges = normalRange?.match(/[\d.]+/g);
  if (!ranges || ranges.length === 0) return status;

  const min = parseFloat(ranges[0]);
  const max = ranges.length > 1 ? parseFloat(ranges[1]) : parseFloat(ranges[0]);

  if (normalRange.includes('<')) {
    if (value >= min) {
      status.isAbnormal = true;
      status.abnormalType = 'high';
    }
  } else if (normalRange.includes('>')) {
    if (value <= min) {
      status.isAbnormal = true;
      status.abnormalType = 'low';
    }
  } else {
    if (value < min) {
      status.isAbnormal = true;
      status.abnormalType = 'low';
    } else if (value > max) {
      status.isAbnormal = true;
      status.abnormalType = 'high';
    }
  }

  return status;
};

const getPossibleCause = (parameterName, abnormalType) => {
  if (abnormalType === 'high') {
    return `An elevated ${parameterName} may indicate inflammation, infection, dehydration, or metabolic imbalance.`;
  }
  if (abnormalType === 'low') {
    return `A reduced ${parameterName} may indicate anemia, deficiency, malabsorption, or organ dysfunction.`;
  }
  return '';
};

const enrichResult = (result) => {
  const status = getAbnormalStatus(result.value, result.normalRange);
  return {
    ...result,
    isAbnormal: status.isAbnormal,
    abnormalType: status.abnormalType,
    possibleCause: status.isAbnormal ? getPossibleCause(result.parameterName, status.abnormalType) : ''
  };
};

export const createReport = async (req, res) => {
  try {
    const { patient, test, results, labDetails, notes } = req.body;

    if (req.user.role !== 'master') {
      const account = await Account.findById(req.user.userId);
      if (!account) return res.status(401).json({ error: 'Account not found' });
      const usage = await getAccountUsage(account._id);
      const licenseStatus = evaluateAccountAccess(account, usage);

      if (!licenseStatus.reportGenerationAllowed) {
        return res.status(403).json({ error: licenseStatus.reasons[0] || 'Report generation is not allowed for this account.' });
      }
    }

    const reportId = generateReportId();
    
    const newReport = new Report({
      createdBy: req.user.role === 'master' ? null : req.user.userId,
      reportId,
      patient,
      test,
      results: results.map(enrichResult),
      dates: {
        sampleCollectionDate: new Date(patient.sampleCollectionDate || new Date()),
        reportDate: new Date()
      },
      labDetails,
      notes,
      status: 'completed'
    });

    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const query = {};
    if (req.user.role !== 'master') {
      query.createdBy = req.user.userId;
    }
    const reports = await Report.find(query).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'master') {
      query.createdBy = req.user.userId;
    }
    const report = await Report.findOne(query);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReportByReportId = async (req, res) => {
  try {
    const query = { reportId: req.params.reportId };
    if (req.user.role !== 'master') {
      query.createdBy = req.user.userId;
    }
    const report = await Report.findOne(query);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { patient, test, results, notes } = req.body;
    
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    if (req.user.role !== 'master' && String(report.createdBy) !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      {
        patient,
        test,
        results: results.map(enrichResult),
        notes,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    if (req.user.role !== 'master' && String(report.createdBy) !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPatientReports = async (req, res) => {
  try {
    const query = { 'patient.patientId': req.params.patientId };
    if (req.user.role !== 'master') {
      query.createdBy = req.user.userId;
    }
    const reports = await Report.find(query);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchReports = async (req, res) => {
  try {
    const { query } = req.query;
    const searchQuery = {
      $or: [
        { 'patient.name': { $regex: query, $options: 'i' } },
        { 'patient.patientId': { $regex: query, $options: 'i' } },
        { reportId: { $regex: query, $options: 'i' } },
        { 'patient.doctorName': { $regex: query, $options: 'i' } },
        { 'patient.contactNo': { $regex: query, $options: 'i' } },
        { 'test.testName': { $regex: query, $options: 'i' } },
        { 'test.testType': { $regex: query, $options: 'i' } }
      ]
    };

    const parsedDate = new Date(query);
    if (!isNaN(parsedDate)) {
      const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
      searchQuery.$or.push({ 'dates.reportDate': { $gte: startOfDay, $lte: endOfDay } });
    }
    if (req.user.role !== 'master') {
      searchQuery.createdBy = req.user.userId;
    }
    const reports = await Report.find(searchQuery);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
