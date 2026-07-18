import {
  Bell,
  Brain,
  FileSearch,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  {
    icon: ScanLine,
    title: "Smart OCR Upload",
    description:
      "Snap or drop a report and OCR instantly extracts the doctor, hospital, diagnosis, medicines and date — auto-categorised for you.",
  },
  {
    icon: Brain,
    title: "AI Medicine Explainer",
    description:
      "Understand any prescription in plain language — usage, side effects and precautions, powered by Gemini AI.",
  },
  {
    icon: FileSearch,
    title: "Natural Language Search",
    description:
      "Just ask. “Show all diabetes reports” or “MRI scans from 2024” and your timeline filters instantly.",
  },
  {
    icon: Users,
    title: "Whole-Family Profiles",
    description:
      "One vault for everyone — kids, parents and grandparents. Track conditions, blood groups and allergies per member.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Never miss a dose, appointment, lab test or vaccination with push and email reminders.",
  },
  {
    icon: QrCode,
    title: "Emergency Card & QR",
    description:
      "A one-tap emergency screen with blood group, allergies and contacts — shareable via QR or PDF.",
  },
  {
    icon: Sparkles,
    title: "AI Report Summaries",
    description:
      "Turn dense lab reports into a clear overview with key findings and suggested next steps.",
  },
  {
    icon: ShieldCheck,
    title: "Bank-Grade Security",
    description:
      "Encrypted storage, role-based access, single-use share links with 24-hour expiry and full audit logs.",
  },
];
