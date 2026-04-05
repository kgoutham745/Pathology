import Report from '../models/Report.js';
import Patient from '../models/Patient.js';
import TestTemplate from '../models/TestTemplate.js';
import Account from '../models/Account.js';
import { generateReportId } from '../utils/helpers.js';

const checkIfAbnormal = (result) => {
  if (!result.value) return false;
  
  const ranges = result.normalRange?.match(/[\d.]+/g);
  if (!ranges || ranges.length === 0) return false;

  const min = parseFloat(ranges[0]);
  const max = ranges.length > 1 ? parseFloat(ranges[1]) : parseFloat(ranges[0]);

  if (result.normalRange.includes('<')) {
    return result.value >= min;
  } else if (result.normalRange.includes('>')) {
    return result.value <= min;
  } else {
    return result.value < min || result.value > max;
  }
};

export const createReport = async (req, res) => {
  try {
    const { patient, test, results, labDetails, notes } = req.body;

    if (req.user.role !== 'master') {
      const account = await Account.findById(req.user.userId);
      if (!account) return res.status(401).json({ error: 'Account not found' });

      const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const reportsThisMonth = await Report.countDocuments({ createdBy: account._id, 'dates.reportDate': { $gte: currentMonthStart } });
      if (reportsThisMonth >= account.license.monthlyReportLimit) {
        return res.status(403).json({ error: 'Monthly report limit reached for this account.' });
      }
    }

    const reportId = generateReportId();
    
    const newReport = new Report({
      createdBy: req.user.role === 'master' ? null : req.user.userId,
      reportId,
      patient,
      test,
      results: results.map(r => ({
        ...r,
        isAbnormal: checkIfAbnormal(r)
      })),
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
        results: results.map(r => ({
          ...r,
          isAbnormal: checkIfAbnormal(r)
        })),
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
        { reportId: { $regex: query, $options: 'i' } }
      ]
    };
    if (req.user.role !== 'master') {
      searchQuery.createdBy = req.user.userId;
    }
    const reports = await Report.find(searchQuery);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
