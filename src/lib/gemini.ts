import { GoogleGenerativeAI } from "@google/generative-ai";

import { isGeminiEnabled } from "./env";

const MODEL = "gemini-1.5-flash";

/**
 * Generate text with Gemini. Returns null when no API key is configured so the
 * caller can fall back to a deterministic demo response.
 */
export async function generateWithGemini(
  prompt: string,
): Promise<string | null> {
  if (!isGeminiEnabled()) return null;
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini error:", err);
    return null;
  }
}
