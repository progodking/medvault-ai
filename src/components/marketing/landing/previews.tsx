import { QRCodeSVG } from "qrcode.react";
import {
  Activity,
  Bell,
  CalendarClock,
  Droplet,
  FlaskConical,
  Phone,
  Pill,
  Syringe,
} from "lucide-react";

import { Reveal } from "@/components/shared/reveal";
import { Card } from "@/components/ui/card";

function TimelinePreview() {
  const items = [
    { icon: Activity, title: "HbA1c Blood Test", meta: "Apollo · 10 Jun 2025", tone: "text-secondary bg-secondary/10" },
    { icon: FlaskConical, title: "Lipid Profile", meta: "Apollo · 22 Mar 2025", tone: "text-primary bg-primary/10" },
    { icon: Activity, title: "Chest X-Ray", meta: "Fortis · 05 Nov 2024", tone: "text-chart-5 bg-[color-mix(in_oklab,var(--chart-5)_12%,transparent)]" },
  ];
  return (
    <Card className="rounded-2xl border-border/70 p-5 shadow-soft">
      <p className="text-sm font-semibold">Medical Timeline</p>
      <div className="mt-4 space-y-3">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-3 rounded-xl border border-border p-3">
            <span className={`flex size-9 items-center justify-center rounded-lg ${it.tone}`}>
              <it.icon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium">{it.title}</p>
              <p className="text-xs text-muted-foreground">{it.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ReminderPreview() {
  const items = [
    { icon: Pill, title: "Metformin 500mg", meta: "Today · 9:00 AM", tone: "text-primary bg-primary/10" },
    { icon: CalendarClock, title: "Cardiology follow-up", meta: "in 2 days", tone: "text-secondary bg-secondary/10" },
    { icon: Syringe, title: "Flu vaccination", meta: "in 9 days", tone: "text-success bg-success/10" },
  ];
  return (
    <Card className="rounded-2xl border-border/70 p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <Bell className="size-4 text-primary" />
        <p className="text-sm font-semibold">Upcoming Reminders</p>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-3 rounded-xl border border-border p-3">
            <span className={`flex size-9 items-center justify-center rounded-lg ${it.tone}`}>
              <it.icon className="size-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">{it.title}</p>
              <p className="text-xs text-muted-foreground">{it.meta}</p>
            </div>
            <span className="size-2 rounded-full bg-success" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function EmergencyPreview() {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 p-0 shadow-soft">
      <div className="brand-gradient p-5 text-white">
        <p className="text-xs uppercase tracking-wider opacity-80">Emergency Card</p>
        <p className="mt-1 font-heading text-lg font-bold">Aarav Sharma</p>
        <p className="text-xs opacity-90">35 yrs · Male</p>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5">
        <div className="flex items-center gap-2">
          <Droplet className="size-4 text-destructive" />
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">Blood</p>
            <p className="text-sm font-semibold">O+</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="size-4 text-secondary" />
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">ICE</p>
            <p className="text-sm font-semibold">Priya</p>
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-between rounded-xl bg-accent p-3">
          <div className="text-xs">
            <p className="font-medium">Allergies: Penicillin</p>
            <p className="text-muted-foreground">Scan for full profile</p>
          </div>
          <div className="rounded-lg bg-white p-1.5">
            <QRCodeSVG value="https://medvault.ai/e/demo" size={56} fgColor="#0F172A" />
          </div>
        </div>
      </div>
    </Card>
  );
}

const blocks = [
  {
    eyebrow: "Organised timeline",
    title: "Every visit, report and scan on one beautiful timeline",
    body: "Filter by year, hospital or condition. Search naturally. Your entire medical history, finally in order.",
    render: <TimelinePreview />,
    reverse: false,
  },
  {
    eyebrow: "Never miss a dose",
    title: "Reminders for medicines, appointments and vaccinations",
    body: "Set morning, afternoon and night schedules with push and email notifications for the whole family.",
    render: <ReminderPreview />,
    reverse: true,
  },
  {
    eyebrow: "Ready for emergencies",
    title: "A shareable emergency card with QR code",
    body: "First responders see blood group, allergies, conditions and contacts instantly — download as PDF or share a secure link.",
    render: <EmergencyPreview />,
    reverse: false,
  },
];

export function Previews() {
  return (
    <section className="bg-card/40 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8">
        {blocks.map((b) => (
          <div
            key={b.title}
            className="grid items-center gap-10 lg:grid-cols-2"
          >
            <Reveal className={b.reverse ? "lg:order-2" : ""}>
              <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
                {b.eyebrow}
              </span>
              <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                {b.title}
              </h3>
              <p className="mt-3 text-muted-foreground">{b.body}</p>
            </Reveal>
            <Reveal delay={0.1} className={b.reverse ? "lg:order-1" : ""}>
              <div className="mx-auto max-w-sm">{b.render}</div>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
