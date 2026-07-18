import type { LucideIcon } from "lucide-react";

import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  tone?: "primary" | "secondary" | "success" | "warning";
  hint?: string;
}

const tones: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  tone = "primary",
  hint,
}: StatCardProps) {
  return (
    <Card className="gap-0 rounded-2xl border-border/70 p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <div className="flex items-center justify-between">
        <span className={cn("flex size-11 items-center justify-center rounded-xl", tones[tone])}>
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-4 font-heading text-3xl font-bold">
        <AnimatedCounter value={value} suffix={suffix} />
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
