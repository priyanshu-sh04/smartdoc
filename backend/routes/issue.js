import { Router } from "express";
import {
  issueDocument,
  getRequestedDocs,
} from "../controllers/issueController.js";

const router = Router();

router.post("/issuedoc", issueDocument);
router.get("/getrequests", getRequestedDocs);

export default router;
