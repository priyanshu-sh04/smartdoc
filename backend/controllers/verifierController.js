import { ethers } from 'ethers';
import Document from '../models/Document.js';
import Certificate from '../models/Certificate.js';
import { processDocumentWithOvis } from '../utils/ovisUtils.js';
import { verifyDocumentOnChain } from '../utils/blockchain.js';

export const verifyDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    
    // Step 1: Fetch document and certificate
    const document = await Document.findById(documentId);
    const certificate = await Certificate.findOne({ documentId });
    
    if (!document || !certificate) {
      return res.status(404).json({ error: 'Document or certificate not found' });
    }

    // Step 2: Verify blockchain signature
    const documentHash = ethers.id(document.ipfsHash);
    const isValidOnChain = await verifyDocumentOnChain(documentHash);
    
    if (!isValidOnChain) {
      certificate.verificationStatus = 'REJECTED';
      await certificate.save();
      return res.status(400).json({ error: 'Document signature verification failed' });
    }

    // Step 3: Extract data using OCR and verify against database
    const fileUrl = document.gatewayUrls[0];
    const response = await fetch(fileUrl);
    const fileBuffer = await response.arrayBuffer();
    
    const extractedData = await processDocumentWithOvis(
      Buffer.from(fileBuffer),
      document.mimeType
    );

    // Step 4: Verify against Aadhar database (mock implementation)
    const isAadharVerified = await mockAadharVerification(extractedData);
    
    if (!isAadharVerified) {
      certificate.verificationStatus = 'REJECTED';
      await certificate.save();
      return res.status(400).json({ error: 'Aadhar verification failed' });
    }

    // Step 5: Update verification status
    certificate.verificationStatus = 'VERIFIED';
    await certificate.save();
    
    document.status = 'VERIFIED';
    document.extractedData = extractedData;
    await document.save();

    res.status(200).json({
      message: 'Document verified successfully',
      certificate,
      extractedData
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
};

// Mock Aadhar verification (replace with actual API integration)
const mockAadharVerification = async (extractedData) => {
  // Simulate API call to Aadhar database
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock verification logic
      const isValid = extractedData.name && extractedData.aadharNumber;
      resolve(isValid);
    }, 1000);
  });
};