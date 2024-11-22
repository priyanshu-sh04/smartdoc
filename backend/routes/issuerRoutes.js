import express from 'express';
import { issueCertificate } from '../controllers/issuerController.js';

const router = express.Router();

// Route to issue a certificate for a document
router.post('/certificate', issueCertificate);

export default router;
