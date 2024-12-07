import { Router } from "express";
import { verifyDocument } from "../controllers/verifyController.js"; // Create the controller for the logic


const router = Router();

router.post("/verifydoc", verifyDocument);

export default router;
