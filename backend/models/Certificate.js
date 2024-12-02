import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  issuerId: { type: String, required: true },
  certificateHash: { type: String, required: true },
  blockchainTxHash: String,
  remarks: String,
  validityPeriod: Date,
  issuedAt: { type: Date, default: Date.now },
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING'
  }
});

export default mongoose.model('Certificate', certificateSchema);