import { Router } from "express";
import { verifyDocument } from "../controllers/verifyController.js";  // Create the controller for the logic
// import multer from "multer";
// import { uploadDocument } from "../controllers/uploadController.js";  // Reuse file upload logic from Step 2

const router = Router();

router.post("/verify-document", verifyDocument);

export default router;
