import express from 'express';
import multer from 'multer';
import {
  getLabSettings,
  updateLabSettings,
  uploadLogo
} from '../controllers/labController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/settings', getLabSettings);
router.put('/settings', updateLabSettings);
router.post('/logo', upload.single('logo'), uploadLogo);

export default router;
