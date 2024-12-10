import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateDocumentTemplate(documentType, userData) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
    switch(documentType) {
      case 'ID Card':
        // ID Card Template
        page.drawRectangle({
          x: 50, y: 50,
          width: width - 100,
          height: height - 100,
          color: rgb(0.9, 0.9, 0.9),
        });
  
        page.drawText('OFFICIAL ID CARD', {
          x: width / 2 - 100,
          y: height - 100,
          size: 20,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
  
        page.drawText(`Name: ${userData.name}`, {
          x: 100, y: height - 200,
          size: 12, font: font,
        });
  
        page.drawText(`Aadhaar Number: ${userData.aadhaar}`, {
          x: 100, y: height - 230,
          size: 12, font: font,
        });
  
        page.drawText(`Date of Issue: ${new Date().toLocaleDateString()}`, {
          x: 100, y: height - 260,
          size: 12, font: font,
        });
  
        page.drawText(`Issued By: ${userData.issuingAuthority}`, {
          x: 100, y: height - 290,
          size: 12, font: boldFont,
          color: rgb(0.2, 0.2, 0.6),
        });
        break;
  
      case 'EXPERIENCE_CERTIFICATE':
        // Experience Certificate Template
        page.drawRectangle({
          x: 50, y: 50,
          width: width - 100,
          height: height - 100,
          color: rgb(0.95, 0.95, 1),
        });
  
        page.drawText('EXPERIENCE CERTIFICATE', {
          x: width / 2 - 150,
          y: height - 100,
          size: 24,
          font: boldFont,
          color: rgb(0, 0, 0.6),
        });
  
        page.drawText(`This is to certify that`, {
          x: 100, y: height - 200,
          size: 14, font: font,
        });
  
        page.drawText(`${userData.name}`, {
          x: 100, y: height - 230,
          size: 18,
          font: boldFont,
          color: rgb(0, 0, 0.6),
        });
  
        page.drawText(`has worked with ${userData.companyName} from ${userData.startDate} to ${userData.endDate}`, {
          x: 100, y: height - 260,
          size: 14, font: font,
        });
  
        page.drawText(`Designation: ${userData.designation}`, {
          x: 100, y: height - 290,
          size: 14, font: font,
        });
  
        page.drawText(`Issued By: ${userData.issuingAuthority}`, {
          x: 100, y: height - 350,
          size: 12,
          font: boldFont,
          color: rgb(0.2, 0.2, 0.6),
        });
        break;
  
      default:
        throw new Error('Unsupported document type');
    }
  
    return await pdfDoc.save();
  }