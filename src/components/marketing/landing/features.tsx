import { Reveal } from "@/components/shared/reveal";
import { Card } from "@/components/ui/card";
import { FEATURES } from "@/lib/features";

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
            Everything in one vault
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            A health record system that finally feels effortless
          </h2>
          <p className="mt-4 text-muted-foreground">
            Powerful AI, thoughtful design and serious security — built for the
            way real families manage health.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 0.06}>
              <Card className="group h-full gap-0 rounded-2xl border-border/70 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:brand-gradient group-hover:text-white">
                  <f.icon className="size-6" />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
