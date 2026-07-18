import { GoogleGenerativeAI } from "@google/generative-ai";

import { isGeminiEnabled } from "./env";

const MODEL = "gemini-1.5-flash";

const FENCE_START = "<<<UNTRUSTED_INPUT";
const FENCE_END = "UNTRUSTED_INPUT>>>";

/**
 * Wrap user-supplied text so it can be embedded in a prompt as data rather than
 * instructions. The fence markers are stripped from the value first so a caller
 * cannot break out of the fence, mitigating prompt-injection.
 */
export function fenceUntrusted(value: string): string {
  const cleaned = value
    .replace(/UNTRUSTED_INPUT|<<<|>>>/gi, " ")
    .replace(/\r/g, "")
    .trim();
  return `${FENCE_START}\n${cleaned}\n${FENCE_END}`;
}

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
