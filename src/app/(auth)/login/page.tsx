import type { Metadata } from "next";

import { ClerkAuth } from "@/components/auth/clerk-auth";
import { DemoAuthForm } from "@/components/auth/demo-auth-form";
import { isClerkEnabled } from "@/lib/env";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  if (isClerkEnabled()) return <ClerkAuth mode="login" />;
  return <DemoAuthForm mode="login" />;
}
