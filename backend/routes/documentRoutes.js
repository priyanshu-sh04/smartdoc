import express from "express";
import multer from "multer";
import {
  uploadDocument,
  getAllDocuments,
  processDocument,
} from "../controllers/documentController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory for Helia

router.post("/upload", upload.single("file"), uploadDocument);
// Route to fetch all documents
router.get("/all", getAllDocuments);
router.post("/process-document", upload.single("document"), processDocument);

export default router;
