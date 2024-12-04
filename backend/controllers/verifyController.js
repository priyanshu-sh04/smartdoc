import { PinataSDK } from "pinata-web3";
import { processDocumentWithOvis } from "../utils/ovisUtils.js";
import { createWatermarkedFile } from "../utils/watermark.js";
import Document from "../models/Document.js";
import { ethers } from "ethers";
import "dotenv/config";
import fetch from "node-fetch";
import { convertPdfToImage } from "../utils/PDFtoImage.js";

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});

export const verifyDocument = async (req, res) => {
  const { name, phone, aadhar, ipfsHash } = req.body;
  // Validate environment variables
  if (
    !process.env.PINATA_JWT ||
    !process.env.PINATA_GATEWAY ||
    !process.env.ETHEREUM_RPC_URL ||
    !process.env.REGISTRY_CONTRACT_ADDRESS
  ) {
    throw new Error("Missing required environment variables");
  }

  if (!name || !phone || !aadhar || !ipfsHash) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Step 1: Fetch document from IPFS
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
    const response = await fetch(ipfsUrl);
    const arrayBuffer = await response.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    const imageBuffer = await convertPdfToImage(pdfBuffer);
    console.log("Image Buffer", imageBuffer);
    // Continue with your existing verification process
    const documentDetails = await processDocumentWithOvis(
      imageBuffer
    );
   
    console.log("Extracted DATA - ", documentDetails);

    // Step 3: Verify document using the blockchain contract
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const contract = new ethers.Contract(
      process.env.REGISTRY_CONTRACT_ADDRESS,
      ["function verifyDocument(bytes32) public view returns (bool)"],
      provider
    );
    const documentHash = ethers.keccak256(pdfBuffer);
    const isRegistered = await contract.verifyDocument(documentHash);

    if (!isRegistered) {
      return res
        .status(400)
        .json({ error: "Document not registered on the blockchain" });
    }

    // Step 4: Add verification watermark to the document
    const watermarkedDocument = await createWatermarkedFile(
      pdfBuffer,
      "Verified Document",
      `Verified by ${name}`
    );

    // Step 5: Update Document in MongoDB
    const document = await Document.findOneAndUpdate(
      { ipfsHash },
      { status: "Verified", verificationDetails: documentDetails },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ error: "Document not found in database" });
    }

    // Step 6: Return response
    res.status(200).json({
      message: "Document verified successfully",
      document,
      watermarkedDocument: `data:application/pdf;base64,${watermarkedDocument.toString(
        "base64"
      )}`,
    });
  } catch (error) {
    console.error("Error verifying document:", error);
    const status = error.response?.status || 500;
    res.status(status).json({
      error: "Verification failed",
      details: error.message,
      step: error.step,
    });
  }
};
