import express from "express";
import mongoose from "mongoose";
import {PDFDocument} from 'pdf-lib';
import Request from "../models/Request.js";
import User from "../models/User.js";
import { createWatermarkedFile } from "../utils/watermark.js";
import { uploadToIPFS } from "../utils/ipfsUtils.js";
import { ethers } from "ethers";
import DocumentRegistryABI from "../artifacts/contracts/DocumentRegistry.sol/DocumentRegistry.json" with { type: "json" };
import 'dotenv/config';

const router = express.Router();

// Blockchain setup
const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.REGISTRY_CONTRACT_ADDRESS;
const documentRegistry = new ethers.Contract(
  contractAddress,
  DocumentRegistryABI.abi,  
  wallet
);

router.post("/issue-document", async (req, res) => {
  try {
    const { requestId } = req.body;

    // Validate input
    if (!requestId) {
      return res.status(400).json({ error: "Request ID is required." });
    }

    // Fetch request details
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found." });
    }

    // Fetch user details from MongoDB
    const user = await User.findOne({
      name: request.name,  phone: request.phone,
      aadhaar: request.aadhaar,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in database." });
    }

    // Validate user details
    if (!user.name || !user.phone || !user.aadhaar) {
      return res.status(400).json({ error: "Incomplete user information." });
    }

    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    const text = `Electricity Bill\nName: ${user.name}\nPhone: ${user.phone}\nAadhaar: ${user.aadhaar}\nDate: ${new Date().toLocaleDateString()}`;

    page.drawText(text, {
      x: 50,
      y: height - 100,
      size: fontSize,
    });

    const pdfBytes = await pdfDoc.save();

    // Add watermark
    const watermarkedPdf = await createWatermarkedFile(
      Buffer.from(pdfBytes),
      user.name,
      "Issued by BSES"
    );

    // Upload PDF to IPFS
    const ipfsResponse = await uploadToIPFS(watermarkedPdf, {
      title: "Electricity Bill",
      description: `Electricity bill for ${user.name}`,
    });

    const ipfsHash = ipfsResponse.hash;

    // Register on blockchain
    const documentHash = ethers.keccak256(watermarkedPdf);
    const tx = await documentRegistry.registerDocument(documentHash, ipfsHash);
    
    // Add transaction timeout
    const receipt = await Promise.race([
      tx.wait(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Transaction timeout')), 60000)
      )
    ]);

    // Update request status
    request.status = "Issued";
    request.ipfsHash = ipfsHash;
    request.documentHash = documentHash;
    await request.save();

    res.status(200).json({
      message: "Document issued successfully.",
      ipfsHash,
      documentHash,
    });
  } catch (error) {
    console.error("Error issuing document:", error);
    
    // More specific error handling
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: "Validation failed", details: error.message });
    }
    if (error.name === 'MongoError') {
      return res.status(500).json({ error: "Database error", details: error.message });
    }
    if (error.name === 'EthersError') {
      return res.status(500).json({ error: "Blockchain transaction failed", details: error.message });
    }
    
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
});

export default router;