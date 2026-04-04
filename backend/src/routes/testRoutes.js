import express from 'express';
import {
  getAllTests,
  getTestById,
  getTestByTestId,
  createTest,
  updateTest,
  deleteTest
} from '../controllers/testController.js';

const router = express.Router();

router.post('/', createTest);
router.get('/', getAllTests);
router.get('/:id', getTestById);
router.get('/code/:testId', getTestByTestId);
router.put('/:id', updateTest);
router.delete('/:id', deleteTest);

export default router;
