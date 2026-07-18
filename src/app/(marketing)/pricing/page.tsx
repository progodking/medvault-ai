import type { Metadata } from "next";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

import { Faq } from "@/components/marketing/landing/faq";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing. Start free, upgrade when your family grows.",
};

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Everything a small family needs to get organised.",
    cta: "Start free",
    href: "/signup",
    highlighted: false,
    features: [
      "Up to 3 family members",
      "500 MB secure storage",
      "OCR uploads & auto-categorisation",
      "Medical timeline & search",
      "Basic reminders",
      "Emergency card with QR",
    ],
  },
  {
    name: "Premium",
    price: "₹299",
    period: "per month",
    description: "For growing families who want the full AI experience.",
    cta: "Go Premium",
    href: "/signup",
    highlighted: true,
    features: [
      "Unlimited family members",
      "20 GB secure storage",
      "AI medicine explanations",
      "AI report summaries",
      "Natural-language search",
      "Push + email reminders",
      "Secure share links & audit logs",
      "Priority support",
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
            Pricing
          </span>
          <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
            Simple pricing for every family
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade any time. Cancel whenever you like.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 lg:grid-cols-2">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1}>
              <Card
                className={cn(
                  "relative h-full gap-0 rounded-3xl p-8 shadow-soft",
                  plan.highlighted
                    ? "border-primary/50 shadow-glow"
                    : "border-border/70",
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-8 inline-flex items-center gap-1 rounded-full brand-gradient px-3 py-1 text-xs font-semibold text-white">
                    <Sparkles className="size-3" /> Most popular
                  </span>
                )}
                <h3 className="font-heading text-xl font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="font-heading text-4xl font-extrabold">
                    {plan.price}
                  </span>
                  <span className="mb-1 text-sm text-muted-foreground">
                    /{plan.period}
                  </span>
                </div>
                <Button
                  className={cn(
                    "mt-6 h-11 w-full",
                    plan.highlighted && "brand-gradient text-white shadow-glow",
                  )}
                  variant={plan.highlighted ? "default" : "outline"}
                  render={<Link href={plan.href}>{plan.cta}</Link>}
                />
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                        <Check className="size-3.5" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Prices are placeholders for demonstration. All plans include bank-grade
          encryption.
        </p>
      </section>

      <Faq />
    </>
  );
}
