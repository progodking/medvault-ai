import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Reveal } from "@/components/shared/reveal";

const stats = [
  { value: 50000, suffix: "+", label: "Families protected" },
  { value: 2, suffix: "M+", label: "Records stored" },
  { value: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
  { value: 256, suffix: "-bit", label: "Encryption" },
];

export function Trusted() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Trusted by families across the country
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-heading text-4xl font-extrabold brand-text-gradient">
                <AnimatedCounter
                  value={s.value}
                  suffix={s.suffix}
                  decimals={s.decimals ?? 0}
                />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
