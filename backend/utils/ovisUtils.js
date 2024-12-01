import { Client } from "@gradio/client";

/**
 * Process a document using the Ovis API
 * @param {Buffer} fileBuffer - The document file buffer
 * @param {string} mimeType - The mime type of the file
 * @param {string} prompt - Custom prompt for the API (optional)
 * @returns {Promise<Object>} Parsed JSON response from Ovis
 */
export const processDocumentWithOvis = async (
  fileBuffer,
  mimeType,
  customPrompt = null
) => {
  try {
    // Connect to the Ovis API
    const client = await Client.connect("AIDC-AI/Ovis1.6-Llama3.2-3B");

    // Convert the buffer to a Blob
    const imageBlob = new Blob([fileBuffer], { type: mimeType });

    // Default prompt for extracting personal details
    const defaultPrompt =
      "Give the personal details of the person who owns this document strictly in JSON Format, nothing else";
    const prompt = customPrompt || defaultPrompt;
    console.log(customPrompt, mimeType);
    // Send the image and get response
    const imageResponse = await client.predict("/ovis_chat", {
      chatbot: [[prompt, null]],
      image_input: imageBlob,
    });

    // Extract and parse the JSON response
    const rawResponse = imageResponse.data[0][0][1];

    // Extract JSON string from between code blocks if present
    const jsonMatch =
      rawResponse.match(/```json\n([\s\S]*?)\n```/) ||
      rawResponse.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    // If we matched a code block, use group 1, otherwise use the full match
    const jsonString = jsonMatch[1] || jsonMatch[0];
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Document processing failed: ${error.message}`);
  }
};
