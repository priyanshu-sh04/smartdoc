import express from 'express';
import multer from 'multer';
import { uploadDocument } from '../controllers/documentController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory for Helia

router.post('/upload', upload.single('file'), uploadDocument);

export default router;
