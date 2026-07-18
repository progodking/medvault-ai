"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

import { isClerkEnabled } from "@/lib/env";

/**
 * Wraps the app with Clerk when a publishable key is configured. In demo mode
 * (no key) it renders children directly so the app stays fully usable.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  if (!isClerkEnabled()) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#16C7C7",
          borderRadius: "0.75rem",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
