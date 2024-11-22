import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Document",
  },
  issuerId: {
    type: String, // Changed to String if no dedicated Issuer model
    required: true,
  },
  certificateHash: {
    type: String,
    required: true,
    unique: true, // Ensure no duplicate certificate hashes
  },
  remarks: {
    type: String,
    trim: true, // Remove whitespace
  },
  validityPeriod: {
    type: Date,
    validate: {
      validator: function (v) {
        return v > Date.now(); // Ensure validity period is in the future
      },
      message: "Validity period must be in the future",
    },
  },
  issuedAt: {
    type: Date,
    default: Date.now,
    immutable: true, // Prevent modification after creation
  },
});

export default mongoose.model("Certificate", CertificateSchema);
