import { PinataSDK } from "pinata-web3";
import Document from "../models/Document.js";
import Certificate from "../models/Certificate.js";
import { createWatermarkedFile } from "../utils/watermark.js";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});

export const issueCertificate = async (req, res) => {
  try {
    const { documentId, remarks, validityPeriod } = req.body;

    if (!documentId) {
      return res.status(400).json({ error: "Document ID is required." });
    }

    const issuerId = "self";

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }

    const fileUrl = `https://ipfs.io/ipfs/${document.ipfsHash}`;
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch the document from IPFS.");
    }
    const fileBuffer = await response.arrayBuffer();

    const watermarkedBuffer = await createWatermarkedFile(
      Buffer.from(fileBuffer),
      `Certified by: ${issuerId}`,
      remarks
    );

    const webFile = new File(
      [watermarkedBuffer],
      `${document.originalName}_certified`,
      {
        type: document.mimeType,
      }
    );

    const pinataResponse = await pinata.upload.file(webFile, {
      metadata: {
        name: `${document.originalName}_certified`,
        keyvalues: {
          documentId: documentId,
          issuerId: issuerId,
          remarks: remarks,
          validityPeriod: validityPeriod,
          issuedAt: new Date().toISOString(),
        },
      },
    });

    const watermarkedHash = pinataResponse.IpfsHash;

    const certificate = new Certificate({
      documentId,
      issuerId,
      certificateHash: watermarkedHash,
      remarks,
      validityPeriod: validityPeriod ? new Date(validityPeriod) : null,
      issuedAt: new Date(),
    });

    await certificate.save();

    res.status(201).json({
      message: "Certificate issued successfully.",
      certificate,
    });
  } catch (error) {
    console.error("Error issuing certificate:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};
