import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const createWatermarkedFile = async (
  pdfBuffer,
  watermarkText,
  remarks,
  issuingAuthority
) => {
  try {
    if (!isPDF(pdfBuffer)) {
      throw new Error("Input is not a valid PDF file");
    }

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    pages.forEach((page) => {
      const { width, height } = page.getSize();

      // Main certification watermark
      const certificationText = "CERTIFIED AUTHENTIC DOCUMENT";
      page.drawText(certificationText, {
        x: width / 2 - 200,
        y: height / 2,
        size: 50,
        font: font,
        color: rgb(0.8, 0, 0), // Red color
        opacity: 0.2,
      });

      // Detailed information watermark
      const detailedText = `
        Certified Document
        Issuer: ${issuingAuthority}
        Date of Certification: ${new Date().toLocaleDateString()}
        ${remarks ? `Remarks: ${remarks}` : ""}
        `;

      page.drawText(detailedText, {
        x: 50,
        y: 100,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.7,
      });
    });

    const watermarkedPdfBytes = await pdfDoc.save();
    return Buffer.from(watermarkedPdfBytes);
  } catch (error) {
    console.error("Error creating watermarked PDF:", error);
    throw error;
  }
};

// Generate a random verification code
function generateVerificationCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function isPDF(buffer) {
  return buffer.slice(0, 4).toString() === "%PDF";
}
