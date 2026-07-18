"use client";

import { SignIn, SignUp } from "@clerk/nextjs";

/**
 * Renders Clerk's prebuilt auth widgets, themed to match MedVault AI. Only used
 * when Clerk keys are configured.
 */
export function ClerkAuth({ mode }: { mode: "login" | "signup" }) {
  const appearance = {
    elements: {
      rootBox: "w-full",
      card: "shadow-none bg-transparent p-0",
      headerTitle: "font-heading",
      formButtonPrimary:
        "bg-primary hover:bg-primary/90 text-primary-foreground",
    },
  };

  return mode === "signup" ? (
    <>
      <SignUp
        appearance={appearance}
        signInUrl="/login"
        forceRedirectUrl="/dashboard"
      />
      {/*
        Designates where Clerk renders the Smart CAPTCHA. Without this element
        Clerk falls back to an invisible/modal widget that can fail on localhost
        with Cloudflare Turnstile error 600010. See:
        https://clerk.com/docs/guides/development/managing-bot-protection
      */}
      <div id="clerk-captcha" />
    </>
  ) : (
    <SignIn
      appearance={appearance}
      signUpUrl="/signup"
      forceRedirectUrl="/dashboard"
    />
  );
}
