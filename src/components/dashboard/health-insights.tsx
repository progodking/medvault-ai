"use client";

import {
  Activity,
  CalendarClock,
  FileText,
  HeartPulse,
  Pill,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Card } from "@/components/ui/card";
import { isExpired } from "@/lib/format";
import type { FamilyMember, MedicalRecord, Medicine, Reminder } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Insight {
  icon: LucideIcon;
  tone: "primary" | "success" | "warning" | "secondary";
  text: string;
}

const TONE: Record<Insight["tone"], string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  secondary: "bg-secondary/10 text-secondary",
};

function computeInsights(
  members: FamilyMember[],
  records: MedicalRecord[],
  medicines: Medicine[],
  reminders: Reminder[],
): { score: number; label: string; insights: Insight[] } {
  const now = Date.now();
  const expiredMeds = medicines.filter((m) => isExpired(m.expiryDate));
  const overdue = reminders.filter(
    (r) => !r.completed && new Date(r.dateTime).getTime() < now,
  );
  const conditions = members.reduce((n, m) => n + m.conditions.length, 0);
  const lastRecord = records
    .map((r) => new Date(r.date).getTime())
    .sort((a, b) => b - a)[0];
  const daysSinceRecord = lastRecord
    ? Math.floor((now - lastRecord) / (24 * 60 * 60 * 1000))
    : 999;

  let score = 100;
  score -= expiredMeds.length * 5;
  score -= overdue.length * 4;
  score -= conditions * 3;
  if (daysSinceRecord > 90) score -= 6;
  score = Math.max(55, Math.min(98, score));

  const label =
    score >= 85 ? "Excellent" : score >= 72 ? "Good" : "Needs attention";

  const insights: Insight[] = [];

  if (overdue.length > 0) {
    insights.push({
      icon: CalendarClock,
      tone: "warning",
      text: `${overdue.length} reminder${overdue.length > 1 ? "s are" : " is"} overdue — catch up to stay on track.`,
    });
  }
  if (expiredMeds.length > 0) {
    insights.push({
      icon: Pill,
      tone: "warning",
      text: `${expiredMeds.length} medicine${expiredMeds.length > 1 ? "s have" : " has"} expired — review and refill if still needed.`,
    });
  }
  if (conditions > 0) {
    insights.push({
      icon: HeartPulse,
      tone: "primary",
      text: `${conditions} ongoing condition${conditions > 1 ? "s" : ""} tracked across the family — keep follow-ups scheduled.`,
    });
  }
  insights.push({
    icon: FileText,
    tone: "secondary",
    text:
      daysSinceRecord > 90
        ? "No new records in 90+ days — upload recent reports to keep history current."
        : `History is up to date — last record added ${daysSinceRecord} day${daysSinceRecord === 1 ? "" : "s"} ago.`,
  });
  if (insights.length < 4) {
    insights.push({
      icon: Activity,
      tone: "success",
      text: `${records.length} records safely stored and searchable in one place.`,
    });
  }

  return { score, label, insights: insights.slice(0, 4) };
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative flex size-32 shrink-0 items-center justify-center">
      <svg viewBox="0 0 120 120" className="size-32 -rotate-90">
        <circle cx="60" cy="60" r={r} className="fill-none stroke-white/20" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          className="fill-none stroke-white transition-[stroke-dasharray] duration-1000 ease-out"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center text-white">
        <span className="font-heading text-3xl font-bold">
          <AnimatedCounter value={score} />
        </span>
        <span className="text-[11px] font-medium text-white/85">{label}</span>
      </div>
    </div>
  );
}

export function HealthInsights({
  members,
  records,
  medicines,
  reminders,
}: {
  members: FamilyMember[];
  records: MedicalRecord[];
  medicines: Medicine[];
  reminders: Reminder[];
}) {
  const { score, label, insights } = computeInsights(
    members,
    records,
    medicines,
    reminders,
  );

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border-border/70 p-0 shadow-soft">
      <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex flex-col items-center gap-3 rounded-2xl brand-gradient p-5 text-white">
          <ScoreRing score={score} label={label} />
          <p className="text-xs font-medium text-white/85">Family Health Score</p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="font-heading text-lg font-semibold">Health insights</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Personalised observations from your family&apos;s records.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {insights.map((ins, i) => {
              const Icon = ins.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-border p-3"
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg",
                      TONE[ins.tone],
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <p className="text-xs leading-relaxed text-foreground/90">{ins.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
