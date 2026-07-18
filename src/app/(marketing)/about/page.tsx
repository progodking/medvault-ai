import type { Metadata } from "next";
import { HeartPulse, Lock, Sparkles, Users } from "lucide-react";

import { Cta } from "@/components/marketing/landing/cta";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Reveal } from "@/components/shared/reveal";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description:
    "MedVault AI is on a mission to make family health records effortless, searchable and secure.",
};

const values = [
  { icon: Lock, title: "Privacy first", desc: "Your family's data is encrypted and never sold." },
  { icon: HeartPulse, title: "Built for care", desc: "Designed around real caregiving moments." },
  { icon: Sparkles, title: "AI that helps", desc: "Practical AI that saves time, with clear disclaimers." },
  { icon: Users, title: "For every family", desc: "Accessible, multilingual and inclusive by design." },
];

const stats = [
  { value: 50000, suffix: "+", label: "Families" },
  { value: 2, suffix: "M+", label: "Records secured" },
  { value: 12, suffix: "+", label: "Countries" },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <Reveal>
          <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
            Our mission
          </span>
          <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
            Health records shouldn&apos;t live in a shoebox
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Every family knows the panic of hunting for a prescription before an
            appointment, or scrolling endless WhatsApp chats for a lab report.
            MedVault AI was born to end that chaos — a single, secure,
            AI-powered home for your family&apos;s entire medical history.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <p className="font-heading text-3xl font-extrabold brand-text-gradient sm:text-4xl">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 4) * 0.06}>
                <Card className="h-full gap-0 rounded-2xl border-border/70 p-6 shadow-soft">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
                    <v.icon className="size-6" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
}
