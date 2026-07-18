/**
 * Feature detection for optional integrations. The app is fully functional in
 * "demo mode" (no external services). When the relevant env vars are present the
 * corresponding integration activates automatically.
 */

export const isClerkEnabled = (): boolean =>
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder");

export const isSupabaseEnabled = (): boolean =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isGeminiEnabled = (): boolean =>
  !!process.env.GEMINI_API_KEY &&
  !process.env.GEMINI_API_KEY.includes("placeholder");

export const isDatabaseEnabled = (): boolean => !!process.env.DATABASE_URL;
