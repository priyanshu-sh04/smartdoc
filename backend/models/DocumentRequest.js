import mongoose from "mongoose";

const DocumentRequestSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  documentType: String,
  purpose: String,
  issuingAuthority: String,
  status: {
    type: String,
    enum: ["PENDING", "ISSUED", "REJECTED"],
    default: "PENDING",
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
  },
  rejectionReason: String,
});

export default mongoose.model('DocumentRequest', DocumentRequestSchema);
