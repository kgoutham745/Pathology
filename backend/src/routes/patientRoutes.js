import express from 'express';
import {
  createPatient,
  getPatients,
  getPatientById,
  searchPatients,
  updatePatient,
  deletePatient
} from '../controllers/patientController.js';

const router = express.Router();

router.post('/', createPatient);
router.get('/', getPatients);
router.get('/search', searchPatients);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;
