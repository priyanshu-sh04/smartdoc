import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'ISSUED', 'VERIFIED', 'REJECTED'],
    default: 'PENDING'
  },
  ipfsHash: String,
  fileSize: Number,
  originalName: String,
  mimeType: String,
  gatewayUrls: [String],
  extractedData: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Document', documentSchema);