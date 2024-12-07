import express from "express";
import {PDFDocument} from 'pdf-lib';
import Request from "../models/Request.js";
import User from "../models/verifierDB.js";
import { createWatermarkedFile } from "../utils/watermark.js";
import { uploadToIPFS } from "../utils/ipfsUtils.js";
import { ethers } from "ethers";
import DocumentRegistryABI from "../artifacts/contracts/DocumentRegistry.sol/DocumentRegistry.json" with { type: "json" };
import 'dotenv/config';


// Blockchain setup
const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.REGISTRY_CONTRACT_ADDRESS;
const documentRegistry = new ethers.Contract(
  contractAddress,
  DocumentRegistryABI.abi,  
  wallet
);

export const issueDocument = async (req, res) => {
    try {
      const { requestId, documentType } = req.body;
  
      // Validate input
      if (!requestId || !documentType) {
        return res.status(400).json({ error: "Request ID and Document Type are required." });
      }
  
      // Fetch request details
      const request = await Request.findById(requestId);
      if (!request) {
        return res.status(404).json({ error: "Request not found." });
      }
  
      // Fetch user details
      const user = await User.findOne({
        name: request.name,
        phone: request.phone,
        aadhaar: request.aadhaar,
      });
  
      if (!user) {
        return res.status(404).json({ error: "User not found in database." });
      }
  
      // Prepare userData based on document type
      const userData = documentType === 'ID_CARD' 
        ? {
            name: user.name,
            aadhaar: user.aadhaar,
            issuingAuthority: request.issuingAuthority
          }
        : documentType === 'EXPERIENCE_CERTIFICATE'
        ? {
            name: user.name,
            companyName: request.companyName, // Assume this is added to request model
            startDate: request.startDate,
            endDate: request.endDate,
            designation: request.designation,
            issuingAuthority: request.issuingAuthority
          }
        : null;
  
      if (!userData) {
        return res.status(400).json({ error: "Invalid document type" });
      }
  
      // Generate PDF using the new template function
      const pdfBytes = await generateDocumentTemplate(documentType, userData);
  
      // Add watermark
      const watermarkedPdf = await createWatermarkedFile(
        Buffer.from(pdfBytes),
        user.name,
        "Issued by Issuing Authority",
        request.issuingAuthority
      );
  
      // Upload PDF to IPFS
      const ipfsResponse = await uploadToIPFS(watermarkedPdf, {
        title: `${documentType} for ${user.name}`,
        description: `${documentType} issued to ${user.name}`,
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
}
