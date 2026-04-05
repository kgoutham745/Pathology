import express from 'express';
import {
  getAccounts,
  createAccount,
  getAccount,
  updateAccount,
  deleteAccount,
  toggleAccountStatus
} from '../controllers/accountController.js';

const router = express.Router();

router.get('/', getAccounts);
router.post('/', createAccount);
router.get('/:id', getAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);
router.patch('/:id/status', toggleAccountStatus);

export default router;
