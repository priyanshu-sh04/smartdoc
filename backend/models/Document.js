import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  ipfsHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Document', DocumentSchema);
