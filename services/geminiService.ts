
import { GoogleGenAI } from "@google/genai";

export async function generateMarketingImage(
  productBase64: string,
  characterPrompt: string,
  backgroundPrompt: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Clean the base64 string to remove the header if present
  const base64Data = productBase64.split(',')[1] || productBase64;

  const prompt = `
    Task: High-end professional beauty marketing image editing.
    Model: ${characterPrompt}.
    Context: The model is in a ${backgroundPrompt}.
    Action: The model is holding the PROVIDED PRODUCT in their hands naturally, presenting it to the camera.
    
    CRITICAL REQUIREMENTS:
    1. KEEP THE PRODUCT EXACTLY AS IT IS. Do not change its colors, labels, text, or shape.
    2. The product size should be realistic relative to the model's hand.
    3. The lighting on the product must match the lighting of the ${backgroundPrompt}.
    4. Ensure the character is clearly a Vietnamese person as described.
    5. High-quality, cinematic photography, sharp focus on the product and the model's face.
    6. Do not add extra text or watermarks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/png'
            }
          },
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data returned from AI");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
}
