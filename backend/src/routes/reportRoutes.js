import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  getReportByReportId,
  updateReport,
  deleteReport,
  getPatientReports,
  searchReports
} from '../controllers/reportController.js';

const router = express.Router();

router.post('/', createReport);
router.get('/', getReports);
router.get('/search', searchReports);
router.get('/:id', getReportById);
router.get('/report/:reportId', getReportByReportId);
router.get('/patient/:patientId', getPatientReports);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

export default router;
