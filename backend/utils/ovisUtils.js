import { Client } from "@gradio/client";
import { fromPath } from "pdf2pic";
import { promises as fs } from "fs"; 

export const processDocumentWithOvis = async (fileBuffer, mimeType) => {
  try {
    const client = await Client.connect("AIDC-AI/Ovis1.6-Llama3.2-3B");

    // Create temp directory if it doesn't exist
    await fs.mkdir("./temp", { recursive: true });

    const tempPdfPath = "./temp/document.pdf";
    await fs.writeFile(tempPdfPath, fileBuffer);

    const options = {
      density: 100,
      saveFilename: "temp",
      savePath: "./temp",
      format: "png",
    };

    // Convert using Promise-based approach
    const convert = fromPath(tempPdfPath, options);
    const pageImage = await convert(1);

    const imageBuffer = await fs.readFile(pageImage.path);
    const imageFile = new File([imageBuffer], "image.png", {
      type: "image/png",
    });

    const result = await client.predict("/ovis_chat", {
      chatbot: [["Extract personal details in JSON format only, nothing else", null]],
      image_input: imageFile,
    });

    // Cleanup temp files
    await fs.unlink(tempPdfPath);
    await fs.unlink(pageImage.path);

    if (!result?.data?.[0]?.[0]?.[1]) throw new Error("Invalid API response");

    const jsonStr = result.data[0][0][1];
    return JSON.parse(jsonStr.match(/\{[\s\S]*\}/)?.[0] || "{}");
  } catch (error) {
    throw new Error(`Document processing failed: ${error.message}`);
  }
};
