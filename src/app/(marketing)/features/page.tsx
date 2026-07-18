import type { Metadata } from "next";
import {
  FileKey,
  History,
  KeyRound,
  Link2,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { Cta } from "@/components/marketing/landing/cta";
import { Reveal } from "@/components/shared/reveal";
import { Card } from "@/components/ui/card";
import { FEATURES } from "@/lib/features";

export const metadata: Metadata = {
  title: "Features",
  description:
    "OCR uploads, AI medicine explanations, natural-language search, reminders, emergency cards and bank-grade security.",
};

const security = [
  { icon: FileKey, title: "Encrypted storage", desc: "Records encrypted at rest and in transit." },
  { icon: KeyRound, title: "OTP & JWT auth", desc: "Verified sign-in with secure session tokens." },
  { icon: UserCog, title: "Role-based access", desc: "Control who can view each member's data." },
  { icon: Link2, title: "Secure share links", desc: "Single-use links that expire in 24 hours." },
  { icon: History, title: "Audit logs", desc: "Every access and change is recorded." },
  { icon: ShieldCheck, title: "Privacy by design", desc: "Your data is yours — export anytime." },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
            Features
          </span>
          <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
            Everything your family&apos;s health needs
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            From OCR uploads to AI insights and emergency-ready cards — all in one
            beautifully secure vault.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.06}>
              <Card className="h-full gap-0 rounded-2xl border-border/70 p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow">
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
                  <f.icon className="size-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Security you can trust with your family
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {security.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 0.06}>
                <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                    <s.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
}
