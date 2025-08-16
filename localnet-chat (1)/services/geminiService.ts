
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: `A vibrant, fun, gen-z style sticker or meme about: ${prompt}`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error("Image generation failed: No images returned.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    // Provide a more user-friendly error message
    if (error instanceof Error && error.message.includes('permission')) {
        throw new Error("API key is invalid or has insufficient permissions.");
    }
    throw new Error("Failed to generate image. Please try again later.");
  }
};
   