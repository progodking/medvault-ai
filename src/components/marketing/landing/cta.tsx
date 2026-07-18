import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl brand-gradient px-6 py-16 text-center text-white shadow-glow sm:px-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_40%)]" />
            <div className="relative">
              <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                Your family&apos;s health, secured together
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/90">
                Join thousands of families who never lose a medical report again.
                Start free — no credit card required.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 gap-2 bg-white px-6 text-base text-accent hover:bg-white/90"
                  render={<Link href="/signup">Create your vault <ArrowRight className="size-4" /></Link>}
                />
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/40 bg-white/10 px-6 text-base text-white hover:bg-white/20"
                  render={<Link href="/pricing">View pricing</Link>}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
