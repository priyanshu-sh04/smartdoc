// routes/documentRequest.js
import express from 'express';
import { 
  createDocumentRequest, 
  getPendingRequests,
  processRequest 
} from '../controllers/documentRequestController.js';

const router = express.Router();

// Routes without auth middleware
router.post('/request', createDocumentRequest);
router.get('/pending/:authority', getPendingRequests);
router.post('/process/:requestId', processRequest);

export default router;