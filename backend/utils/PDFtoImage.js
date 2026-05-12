import { promises as fs } from "fs";
import os from "os";
import path from "path";

export const convertPdfToImage = async (pdfBuffer) => {
  let PDFNet;
  let tempPdfPath;
  let outputPath;

  try {
    ({ PDFNet } = await import("@pdftron/pdfnet-node"));

    tempPdfPath = path.join(
      os.tmpdir(),
      `smartdoc-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`
    );
    await fs.writeFile(tempPdfPath, pdfBuffer);

    // Main conversion function
    const main = async () => {
      // Initialize PDFNet
      const doc = await PDFNet.PDFDoc.createFromFilePath(tempPdfPath);

      // Create a PDFDraw object for rendering
      const draw = await PDFNet.PDFDraw.create();

      // Set rendering options (optional)
      await draw.setDPI(300); // High-quality rendering

      // Get the first page
      const page = await doc.getPage(1);

      // Output image path
      const outputImagePath = path.join(
        os.tmpdir(),
        `smartdoc-${Date.now()}-${Math.random().toString(36).slice(2)}.png`
      );

      // Export the page as a PNG
      await draw.export(page, outputImagePath, "PNG");

      return outputImagePath;
    };

    // Run the conversion with your license key
    outputPath = await PDFNet.runWithCleanup(
      main,
      process.env.PDFTRON_LICENSE_KEY // Store your license in environment variables
    );

    // Read the converted image
    const imageBuffer = await fs.readFile(outputPath);

    // Clean up temporary files
    await fs.unlink(tempPdfPath).catch(() => {});
    await fs.unlink(outputPath).catch(() => {});

    return imageBuffer;
  } catch (error) {
    console.error("PDFNet conversion error:", error);
    throw new Error(`PDF to Image conversion failed: ${error.message}`);
  } finally {
    // Shutdown PDFNet
    if (PDFNet) {
      await PDFNet.shutdown().catch(() => {});
    }
    if (tempPdfPath) {
      await fs.unlink(tempPdfPath).catch(() => {});
    }
    if (outputPath) {
      await fs.unlink(outputPath).catch(() => {});
    }
  }
};
