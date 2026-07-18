import { HeartPulse, Lock, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE } from "@/lib/constants";

const highlights = [
  { icon: ShieldCheck, text: "Bank-grade encrypted storage" },
  { icon: Sparkles, text: "AI-powered medicine insights" },
  { icon: HeartPulse, text: "Every family member in one vault" },
  { icon: Lock, text: "Secure share links & audit logs" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden brand-gradient p-12 text-white lg:flex lg:flex-col">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.28),transparent_45%)]" />
        <Link href="/" className="relative">
          <Logo textClassName="text-white [&_.text-foreground]:text-white" />
        </Link>
        <div className="relative mt-auto">
          <h2 className="max-w-md font-heading text-3xl font-extrabold leading-tight">
            {SITE.tagline}
          </h2>
          <p className="mt-4 max-w-md text-white/85">
            The secure home for your family&apos;s medical records, prescriptions
            and history — organised by AI, protected by design.
          </p>
          <ul className="mt-8 space-y-3">
            {highlights.map((h) => (
              <li key={h.text} className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-white/15">
                  <h.icon className="size-4" />
                </span>
                <span className="text-sm">{h.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between p-6">
          <Link href="/" className="lg:hidden">
            <Logo />
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
