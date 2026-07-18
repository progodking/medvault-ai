import {
  Bell,
  HeartPulse,
  LayoutDashboard,
  Pill,
  ShieldAlert,
  Settings,
  Upload,
  Users,
  type LucideIcon,
} from "lucide-react";

export const SITE = {
  name: "MedVault AI",
  tagline: "Your Family. Your Health. Securely Together.",
  description:
    "A secure, AI-powered family health vault. Store, organize, search and manage the medical records of every family member — reports, prescriptions, medicines and more.",
  url: "https://medvault.ai",
} as const;

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const DASHBOARD_NAV: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Family Members", href: "/dashboard/family", icon: Users },
  { title: "Timeline", href: "/dashboard/timeline", icon: HeartPulse },
  { title: "Upload Reports", href: "/dashboard/upload", icon: Upload },
  { title: "Medicine Vault", href: "/dashboard/medicines", icon: Pill },
  { title: "Reminders", href: "/dashboard/reminders", icon: Bell },
  { title: "Emergency Card", href: "/dashboard/emergency", icon: ShieldAlert },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const MARKETING_NAV = [
  { title: "Features", href: "/features" },
  { title: "Pricing", href: "/pricing" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
] as const;

export const AI_DISCLAIMER =
  "This information is for educational purposes only and is not a substitute for professional medical advice. Always consult a qualified healthcare provider.";

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const RELATIONSHIPS = [
  "Self",
  "Spouse",
  "Son",
  "Daughter",
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Grandfather",
  "Grandmother",
  "Other",
] as const;

export const RECORD_CATEGORIES = [
  "Report",
  "Prescription",
  "Bill",
  "Scan",
  "Visit",
  "Vaccination",
] as const;

export const REMINDER_TYPES = [
  "Medicine",
  "Appointment",
  "Lab Test",
  "Vaccination",
] as const;
