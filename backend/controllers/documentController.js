import Document from '../models/Document.js';
import setupHelia from '../helia.js';

const helia = await setupHelia(); // Initialize Helia

// Upload Document Handler
export const uploadDocument = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    // Validate input
    if (!req.file || !title || !userId) {
      return res.status(400).json({ error: 'File, title, and userId are required' });
    }

    // Add file to IPFS using Helia
    const { buffer } = req.file;
    const { cid } = await helia.add(buffer);

    // Save document metadata to MongoDB
    const newDocument = new Document({
      title,
      description,
      userId,
      ipfsHash: cid.toString(),
    });

    await newDocument.save();

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: newDocument,
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
