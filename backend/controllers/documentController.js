import { PinataSDK } from "pinata-web3";
import mongoose from 'mongoose';
import Document from '../models/Document.js';
import 'dotenv/config'

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT, 
  pinataGateway: process.env.PINATA_GATEWAY 
});

export const uploadDocument = async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const file = req.file;

    // Debugging: Log the entire request body and file
    console.log('Request body:', req.body);
    console.log('Uploaded file:', file);

    if (!file || !title || !userId) {
      return res.status(400).json({ error: 'File, title, and userId are required' });
    }

    // For memory storage, use the buffer directly
    const fileBuffer = file.buffer;

    // Create Web File object
    const webFile = new File([fileBuffer], file.originalname || 'unnamed', {
      type: file.mimetype || 'application/octet-stream'
    });

    // Upload to Pinata 
    const pinataResponse = await pinata.upload.file(webFile, {
      metadata: {
        name: file.originalname || 'unnamed',
        keyvalues: {
          title: title,
          description: description,
          userId: userId,
          uploadedAt: new Date().toISOString()
        }
      }
    });

    // Create document in MongoDB
    const newDocument = new Document({
      title,
      description,
      userId: new mongoose.Types.ObjectId(userId),
      ipfsHash: pinataResponse.IpfsHash,
      fileSize: fileBuffer.length,
      originalName: file.originalname || 'unnamed',
      mimeType: file.mimetype || 'application/octet-stream',
      gatewayUrls: [
        `https://${process.env.PINATA_GATEWAY}/ipfs/${pinataResponse.IpfsHash}`,
        `https://ipfs.io/ipfs/${pinataResponse.IpfsHash}`
      ]
    });

    await newDocument.save();

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: newDocument,
      ipfsUrls: [
        `https://${process.env.PINATA_GATEWAY}/ipfs/${pinataResponse.IpfsHash}`,
        `https://ipfs.io/ipfs/${pinataResponse.IpfsHash}`
      ]
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error.message 
    });
  }
};