import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  // Generate userId on login using uuid v4
  userId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
  ipfsHash: { type: String, required: true },
  fileSize: { type: Number },
  originalName: { type: String },
  mimeType: { type: String },
  gatewayUrls: [String],
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }, // Link to the certificate
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Document', DocumentSchema);
