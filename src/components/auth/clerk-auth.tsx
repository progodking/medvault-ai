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
    <SignUp
      appearance={appearance}
      signInUrl="/login"
      forceRedirectUrl="/dashboard"
    />
  ) : (
    <SignIn
      appearance={appearance}
      signUpUrl="/signup"
      forceRedirectUrl="/dashboard"
    />
  );
}
