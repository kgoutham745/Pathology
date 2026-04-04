import Report from '../models/Report.js';
import Patient from '../models/Patient.js';
import TestTemplate from '../models/TestTemplate.js';
import { generateReportId } from '../utils/helpers.js';

export const createReport = async (req, res) => {
  try {
    const { patient, test, results, labDetails, notes } = req.body;
    
    const reportId = generateReportId();
    
    const newReport = new Report({
      reportId,
      patient,
      test,
      results: results.map(r => ({
        ...r,
        isAbnormal: checkIfAbnormal(r)
      })),
      dates: {
        sampleCollectionDate: new Date(patient.sampleCollectionDate),
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
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReportByReportId = async (req, res) => {
  try {
    const report = await Report.findOne({ reportId: req.params.reportId });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { patient, test, results, notes } = req.body;
    
    const report = await Report.findByIdAndUpdate(
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

    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPatientReports = async (req, res) => {
  try {
    const reports = await Report.find({ 'patient.patientId': req.params.patientId });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchReports = async (req, res) => {
  try {
    const { query } = req.query;
    const reports = await Report.find({
      $or: [
        { 'patient.name': { $regex: query, $options: 'i' } },
        { 'patient.patientId': { $regex: query, $options: 'i' } },
        { reportId: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
