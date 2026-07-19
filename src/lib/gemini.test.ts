import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const generateContent = vi.fn();
const getGenerativeModel = vi.fn(() => ({ generateContent }));

vi.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: vi.fn(() => ({ getGenerativeModel })),
}));

import { GoogleGenerativeAI } from "@google/generative-ai";

import { generateWithGemini } from "./gemini";

describe("generateWithGemini", () => {
  const original = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GEMINI_API_KEY;
  });

  afterEach(() => {
    if (original === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = original;
  });

  it("returns null and skips the API when Gemini is disabled", async () => {
    const result = await generateWithGemini("hello");
    expect(result).toBeNull();
    expect(GoogleGenerativeAI).not.toHaveBeenCalled();
  });

  it("returns null when the key is a placeholder", async () => {
    process.env.GEMINI_API_KEY = "placeholder";
    expect(await generateWithGemini("hi")).toBeNull();
    expect(GoogleGenerativeAI).not.toHaveBeenCalled();
  });

  it("returns generated text when Gemini is enabled", async () => {
    process.env.GEMINI_API_KEY = "AIzaReal";
    generateContent.mockResolvedValue({
      response: { text: () => "explained" },
    });
    const result = await generateWithGemini("explain paracetamol");
    expect(result).toBe("explained");
    expect(GoogleGenerativeAI).toHaveBeenCalledWith("AIzaReal");
    expect(getGenerativeModel).toHaveBeenCalledWith({
      model: "gemini-1.5-flash",
    });
    expect(generateContent).toHaveBeenCalledWith("explain paracetamol");
  });

  it("returns null and logs when the API call throws", async () => {
    process.env.GEMINI_API_KEY = "AIzaReal";
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    generateContent.mockRejectedValue(new Error("network down"));
    expect(await generateWithGemini("boom")).toBeNull();
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });
});
