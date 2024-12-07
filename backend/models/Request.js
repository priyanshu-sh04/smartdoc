import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  aadhaar: { type: String, required: true },
  issuingAuthority: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  documentType: { 
    type: String, 
    enum: ['ID_CARD', 'EXPERIENCE_CERTIFICATE'],
    required: true 
  },
  // these fields will only be filled if experience certificate is selected
  companyName: String,
  startDate: Date,
  endDate: Date,
  designation: String,
});

export default mongoose.model("Request", requestSchema);
