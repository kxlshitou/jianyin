import { GoogleGenAI, Type } from "@google/genai";

// Initialize the AI client
// Note: In a real production app, calls should go through a backend to protect the key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateScript = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a short, engaging video script (approx 30 seconds) about: ${topic}. 
      Format it as a list of scenes with visual descriptions and voiceover text. 
      Return plain text.`,
      config: {
        systemInstruction: "You are a professional video editor and scriptwriter.",
      },
    });
    return response.text || "Failed to generate script.";
  } catch (error) {
    console.error("Gemini Script Generation Error:", error);
    return "Error generating script. Please check your API key.";
  }
};

export const generateAiImage = async (prompt: string): Promise<string | null> => {
  try {
    // Using imagen-4.0-generate-001 for high quality image generation as recommended
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64ImageBytes) {
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    // Fallback handling if Imagen is not available in specific environment,
    // though Imagen 3/4 is the standard recommendation now.
    return null;
  }
};

export const suggestEditIdeas = async (currentAssets: string[]): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `I have a video project with these assets: ${currentAssets.join(', ')}. Suggest 3 creative editing ideas or visual effects styles to apply.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });
    
    const text = response.text;
    if (text) {
      return JSON.parse(text) as string[];
    }
    return [];
  } catch (e) {
    console.error(e);
    return ["Add a cinematic filter", "Use fast cuts for energy", "Add calm background music"];
  }
};