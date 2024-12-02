import DocumentRequest from "../models/DocumentRequest.js";
import { uploadDocument } from "./documentController.js";
import { createWatermarkedFile } from "../utils/watermark.js";
import {
  registerDocumentOnChain,
  verifyDocumentOnChain,
} from "../utils/blockchain.js";
import { processDocumentWithOvis } from "../utils/ovisUtils.js";
import { ethers } from "ethers";
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});

// Mock Database for Verification
const MOCK_DATABASES = {
  Aadhar: [
    { name: "John Doe", aadharNumber: "1234-5678-9012" },
    { name: "Jane Smith", aadharNumber: "9876-5432-1098" },
  ],
  PAN: [
    { name: "Michael Johnson", panNumber: "ABCDE1234F" },
    { name: "Emily Brown", panNumber: "FGHIJ5678K" },
  ],
  DrivingLicense: [
    { name: "Robert Williams", licenseNumber: "DL-1234567" },
    { name: "Sarah Lee", licenseNumber: "DL-7654321" },
  ],
};

export const processDocumentRequest = async (req, res) => {
  try {
    const { documentRequestId } = req.body;

    // 1. Fetch Document Request
    const documentRequest = await DocumentRequest.findById(documentRequestId);
    if (!documentRequest) {
      return res.status(404).json({ error: "Document request not found" });
    }

    // 2. Mock Database Verification
    const mockDatabaseEntries =
      MOCK_DATABASES[documentRequest.documentType] || [];
    const isUserInDatabase = mockDatabaseEntries.some(
      (entry) => entry.name === documentRequest.userName
    );

    if (!isUserInDatabase) {
      documentRequest.status = "REJECTED";
      documentRequest.rejectionReason = "User not found in records";
      await documentRequest.save();

      console.log("Verification Failed: User not in records");
      return res.status(400).json({ error: "User not found in records" });
    }

    // 3. If user exists, proceed with document upload
    if (!req.file) {
      return res.status(400).json({ error: "No document uploaded" });
    }

    // 4. Upload Original Document
    const uploadResult = await uploadDocument(req, res);
    const document = uploadResult.document;

    // 5. Process Document with OCR
    const extractedData = await processDocumentWithOvis(
      req.file.buffer,
      req.file.mimetype,
      `Verify details for ${documentRequest.documentType}`
    );

    // 6. Create Watermarked Document
    const watermarkedBuffer = await createWatermarkedFile(
      req.file.buffer,
      `Issued by: Government Authority`,
      `Document Type: ${documentRequest.documentType}`
    );

    // 7. Upload Watermarked Document to IPFS
    const watermarkedFile = new File(
      [watermarkedBuffer],
      `${req.file.originalname}_verified`,
      { type: req.file.mimetype }
    );

    const watermarkedPinataResponse = await pinata.upload.file(
      watermarkedFile,
      {
        metadata: {
          name: `${req.file.originalname}_verified`,
          keyvalues: {
            documentType: documentRequest.documentType,
            userId: document.userId,
          },
        },
      }
    );

    // 8. Blockchain Registration
    const documentHash = ethers.id(document.ipfsHash);
    const blockchainTxHash = await registerDocumentOnChain(
      documentHash,
      document.ipfsHash
    );

    // 9. Verify on Blockchain
    const isVerifiedOnChain = await verifyDocumentOnChain(documentHash);

    if (!isVerifiedOnChain) {
      console.log("Blockchain Verification Failed");
      // Optionally handle blockchain verification failure
    }

    // 10. Update Document Request and Document
    documentRequest.status = "ISSUED";
    documentRequest.documentId = document._id;
    await documentRequest.save();

    document.status = "VERIFIED";
    document.extractedData = extractedData;
    document.verifiedIpfsHash = watermarkedPinataResponse.IpfsHash;
    await document.save();

    res.status(201).json({
      message: "Document processed and verified successfully",
      documentRequest,
      originalIpfsHash: document.ipfsHash,
      verifiedIpfsHash: watermarkedPinataResponse.IpfsHash,
      extractedData,
    });
  } catch (error) {
    console.error("Document Processing Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const createDocumentRequest = async (req, res) => {
  try {
    const {
      userName,
      userEmail,
      documentType,
      purpose,
      issuingAuthority,
      additionalDetails = {},
    } = req.body;

    // Validate required fields
    if (
      !userName ||
      !userEmail ||
      !documentType ||
      !purpose ||
      !issuingAuthority
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        requiredFields: [
          "userName",
          "userEmail",
          "documentType",
          "purpose",
          "issuingAuthority",
        ],
      });
    }

    const documentRequest = new DocumentRequest({
      userName,
      userEmail,
      documentType,
      purpose,
      issuingAuthority,
      additionalDetails,
    });

    await documentRequest.save();

    res.status(201).json({
      message: "Document request created successfully",
      request: documentRequest,
    });
  } catch (error) {
    console.error("Error creating document request:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// Get all pending requests for an authority
export const getPendingRequests = async (req, res) => {
  try {
    const { authority } = req.params;

    const requests = await DocumentRequest.find({
      issuingAuthority: authority,
      status: "PENDING",
    });

    res.status(200).json({
      message: "Pending requests retrieved successfully",
      requests,
    });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

// Process (approve/reject) a request
export const processRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action, remarks } = req.body;

    if (!["APPROVED", "REJECTED"].includes(action)) {
      return res.status(400).json({
        error: "Invalid action. Must be either APPROVED or REJECTED",
      });
    }

    const request = await DocumentRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        error: "Document request not found",
      });
    }

    request.status = action;
    if (remarks) {
      request.additionalDetails.remarks = remarks;
    }
    await request.save();

    res.status(200).json({
      message: `Document request ${action.toLowerCase()} successfully`,
      request,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};
