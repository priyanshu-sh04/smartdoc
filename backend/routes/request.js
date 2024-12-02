import express from "express";
import mongoose from "mongoose";
import Request from "../models/Request.js"; // Create this model to track requests

const router = express.Router();

router.post("/request-document", async (req, res) => {
  try {
    const { name, phone, aadhaar, documentType } = req.body;

    // Validate input
    if (!name || !phone || !aadhaar || !documentType) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Save request in the database
    const newRequest = new Request({
      name,
      phone,
      aadhaar,
      documentType,
      status: "Pending",
      createdAt: new Date(),
    });

    await newRequest.save();

    res.status(201).json({
      message: "Document request successfully processed",
      status: "Pending Verification",
      requestId: newRequest._id,
    });
  } catch (error) {
    console.error("Error processing document request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
