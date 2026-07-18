import { Star } from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { initials } from "@/lib/format";

const testimonials = [
  {
    quote:
      "I used to dig through WhatsApp for my dad's cardiac reports before every appointment. Now everything is one tap away. Life-changing during his surgery.",
    name: "Meera Iyer",
    role: "Caregiver, Bengaluru",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&q=80&auto=format&fit=crop",
  },
  {
    quote:
      "The OCR is scary good. I photographed a prescription and it pulled the doctor, medicines and date perfectly. The AI explanations help my parents understand their meds.",
    name: "Rahul Verma",
    role: "Parent of two",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&q=80&auto=format&fit=crop",
  },
  {
    quote:
      "The emergency QR card gave me peace of mind for my mother who lives alone. Paramedics scanned it and knew her allergies instantly.",
    name: "Dr. Anjali Nair",
    role: "Physician & daughter",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=96&q=80&auto=format&fit=crop",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by families who never want to lose a report again
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <Card className="h-full gap-0 rounded-2xl border-border/70 p-6 shadow-soft">
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                  “{t.quote}”
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback>{initials(t.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
