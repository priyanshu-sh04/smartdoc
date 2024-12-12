import { processDocumentWithOvis } from "../utils/ovisUtils.js";
import { uploadToIPFS } from "../utils/ipfsUtils.js";
import verifierDB from "../models/verifierDB.js";


export const verifyDocImg = async (req, res) => {
  try {
    // Check if document type is provided
    console.log(req)
    const { documentType } = req.body;
    if (!documentType) {
      return res.status(400).json({
        error: "Document type is required",
        allowedTypes: [
          "ID Card",
          "Birth Certificate",
          "Experience Certificate",
        ],
      });
    }

    // Determine extraction prompt based on document type
    let prompt = "";
    switch (documentType) {
      case "ID Card":
        prompt =
          "Extract name, phone number, date of birth in JSON format {name, phone, dob}";
        break;
      case "Birth Certificate":
        prompt =
          "Extract name, parents' names, date of birth in JSON format, final output should be fully in english {name, parentName, dob}";
        break;
      case "Experience Certificate":
        prompt =
          "Extract name, employee ID, workplace name in JSON format {name, employeeID, workplace}";
        break;
      default:
        return res.status(400).json({ error: "Unsupported document type" });
    }

    // Process document with Ovis to extract information
    const extractedInfo = await processDocumentWithOvis(
      req.file.buffer,
      prompt
    );
    console.log(extractedInfo);
    // Verify extracted information against official records
    const verifierRecord = await verifierDB.findOne({
      $or: [
        { name: extractedInfo.name },
        { phone: extractedInfo.phone },
        { employeeID: extractedInfo.employeeID },
      ],
    });

    // If no matching record found
    if (!verifierRecord) {
      return res.status(400).json({
        error: "Document details do not match official records",
        extractedInfo,
        misMatchedFields: Object.keys(extractedInfo).filter(
          (key) => !verifierRecord[key]
        ),
      });
    }

    // Upload document to IPFS
    const ipfsResponse = await uploadToIPFS(req.file.buffer);

    // Return successful verification response
    return res.status(200).json({
      message: "Document verified successfully",
      extractedInfo,
      ipfsUrl: ipfsResponse.url,
    });
  } catch (error) {
    console.error("Document verification error:", error);
    return res.status(500).json({
      error: "Verification process failed",
      details: error.message,
    });
  }
};

// Route setup
