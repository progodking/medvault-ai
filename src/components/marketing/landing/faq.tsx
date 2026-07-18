import { Reveal } from "@/components/shared/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is my family's medical data secure?",
    a: "Yes. Data is stored with encryption at rest and in transit, protected by role-based access control. Share links are single-use and expire after 24 hours, and every access is recorded in an audit log.",
  },
  {
    q: "How does the OCR and auto-categorisation work?",
    a: "When you upload a report, on-device OCR reads the text and our system extracts the doctor, hospital, diagnosis, medicines and date, then files it under the right member and category automatically.",
  },
  {
    q: "What can the AI assistant do?",
    a: "It explains medicines in plain language (uses, side effects, precautions), summarises lab reports, and powers natural-language search like ‘show all diabetes reports’. AI output is educational and never a substitute for professional advice.",
  },
  {
    q: "Can I manage records for my whole family?",
    a: "Absolutely. Create a profile for each member — children, parents, grandparents — each with their own timeline, medicines, reminders and emergency card.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The Free plan covers essentials for a small family. Premium unlocks unlimited members, more storage, advanced AI and priority support.",
  },
  {
    q: "Can I export or download my data?",
    a: "Any record can be viewed and downloaded, and emergency cards export to PDF. Your data always belongs to you.",
  },
];

export function Faq() {
  return (
    <section className="border-t border-border bg-card/40 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to know about MedVault AI.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <Accordion className="w-full space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-2xl border border-border bg-card px-5"
              >
                <AccordionTrigger className="text-left font-heading text-base font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
