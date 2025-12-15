import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePosterImage = async (prompt: string, referenceImageBase64: string | null): Promise<string> => {
  const ai = getAiClient();
  
  const parts: any[] = [{ text: prompt }];

  // If a reference image exists, add it to the parts
  if (referenceImageBase64) {
    // Extract base64 data, removing the prefix (e.g., "data:image/jpeg;base64,")
    const base64Data = referenceImageBase64.split(',')[1];
    const mimeType = referenceImageBase64.substring(referenceImageBase64.indexOf(':') + 1, referenceImageBase64.indexOf(';'));
    
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: base64Data
      }
    });
  }

  try {
    // Using gemini-3-pro-image-preview for high fidelity instruction following
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
            aspectRatio: "9:16",
            imageSize: "1K" // Or 2K/4K if available/needed
        }
      }
    });

    // Extract the image from the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        // Assuming PNG based on typical output, but could check standard
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    
    throw new Error("No image generated.");

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
