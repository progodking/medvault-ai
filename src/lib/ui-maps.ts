import {
  Activity,
  CalendarClock,
  FileText,
  FlaskConical,
  Pill,
  Receipt,
  ScanLine,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react";

import type { RecordCategory, ReminderType } from "./types";

export const REMINDER_ICON: Record<ReminderType, LucideIcon> = {
  Medicine: Pill,
  Appointment: CalendarClock,
  "Lab Test": FlaskConical,
  Vaccination: Syringe,
};

export const CATEGORY_ICON: Record<RecordCategory, LucideIcon> = {
  Report: FileText,
  Prescription: Pill,
  Bill: Receipt,
  Scan: ScanLine,
  Visit: Stethoscope,
  Vaccination: Syringe,
};

export const CATEGORY_TONE: Record<RecordCategory, string> = {
  Report: "bg-secondary/10 text-secondary",
  Prescription: "bg-primary/10 text-primary",
  Bill: "bg-warning/10 text-warning",
  Scan: "bg-[color-mix(in_oklab,var(--chart-5)_14%,transparent)] text-chart-5",
  Visit: "bg-success/10 text-success",
  Vaccination: "bg-destructive/10 text-destructive",
};

export const ACTIVITY_ICON = Activity;
