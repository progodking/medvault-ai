import type { Metadata } from "next";

import { ClerkAuth } from "@/components/auth/clerk-auth";
import { DemoAuthForm } from "@/components/auth/demo-auth-form";
import { isClerkEnabled } from "@/lib/env";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  if (isClerkEnabled()) return <ClerkAuth mode="signup" />;
  return <DemoAuthForm mode="signup" />;
}
