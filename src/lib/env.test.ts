import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  isClerkEnabled,
  isDatabaseEnabled,
  isGeminiEnabled,
  isSupabaseEnabled,
} from "./env";

const KEYS = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "GEMINI_API_KEY",
  "DATABASE_URL",
] as const;

describe("env feature detection", () => {
  const original: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of KEYS) {
      original[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of KEYS) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  });

  describe("isClerkEnabled", () => {
    it("is false when the publishable key is missing", () => {
      expect(isClerkEnabled()).toBe(false);
    });

    it("is false when the key is a placeholder value", () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_placeholder_123";
      expect(isClerkEnabled()).toBe(false);
    });

    it("is true for a real key", () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_live_abc";
      expect(isClerkEnabled()).toBe(true);
    });
  });

  describe("isSupabaseEnabled", () => {
    it("is false when either variable is missing", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://x.supabase.co";
      expect(isSupabaseEnabled()).toBe(false);
    });

    it("is true when both URL and anon key are set", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://x.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon_key";
      expect(isSupabaseEnabled()).toBe(true);
    });
  });

  describe("isGeminiEnabled", () => {
    it("is false when the key is missing", () => {
      expect(isGeminiEnabled()).toBe(false);
    });

    it("is false for a placeholder key", () => {
      process.env.GEMINI_API_KEY = "placeholder";
      expect(isGeminiEnabled()).toBe(false);
    });

    it("is true for a real key", () => {
      process.env.GEMINI_API_KEY = "AIzaReal";
      expect(isGeminiEnabled()).toBe(true);
    });
  });

  describe("isDatabaseEnabled", () => {
    it("is false when DATABASE_URL is missing", () => {
      expect(isDatabaseEnabled()).toBe(false);
    });

    it("is true when DATABASE_URL is set", () => {
      process.env.DATABASE_URL = "postgres://localhost/db";
      expect(isDatabaseEnabled()).toBe(true);
    });
  });
});
