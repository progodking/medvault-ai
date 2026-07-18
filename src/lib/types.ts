export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type Relationship =
  | "Self"
  | "Spouse"
  | "Son"
  | "Daughter"
  | "Father"
  | "Mother"
  | "Brother"
  | "Sister"
  | "Grandfather"
  | "Grandmother"
  | "Other";

export interface FamilyMember {
  id: string;
  name: string;
  relationship: Relationship;
  dateOfBirth: string; // ISO date
  gender: "Male" | "Female" | "Other";
  bloodGroup: BloodGroup;
  photoUrl?: string;
  conditions: string[];
  allergies: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  heightCm?: number;
  weightKg?: number;
  createdAt: string;
}

export type RecordCategory =
  | "Report"
  | "Prescription"
  | "Bill"
  | "Scan"
  | "Visit"
  | "Vaccination";

export interface MedicalRecord {
  id: string;
  memberId: string;
  title: string;
  category: RecordCategory;
  date: string; // ISO date
  doctorName?: string;
  hospital?: string;
  diagnosis?: string;
  medicines?: string[];
  notes?: string;
  fileUrl?: string;
  fileType?: "pdf" | "image";
  tags: string[];
  createdAt: string;
}

export type Frequency = "morning" | "afternoon" | "night";

export interface Medicine {
  id: string;
  memberId: string;
  name: string;
  dosage: string;
  schedule: Frequency[];
  startDate: string;
  endDate?: string;
  reminderEnabled: boolean;
  notes?: string;
  expiryDate?: string;
  createdAt: string;
}

export type ReminderType =
  | "Medicine"
  | "Appointment"
  | "Lab Test"
  | "Vaccination";

export interface Reminder {
  id: string;
  memberId: string;
  type: ReminderType;
  title: string;
  dateTime: string; // ISO datetime
  notes?: string;
  channels: ("push" | "email")[];
  completed: boolean;
  createdAt: string;
}

export interface EmergencyCard {
  memberId: string;
  bloodGroup: BloodGroup;
  allergies: string[];
  conditions: string[];
  currentMedicines: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  organDonor?: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  target: string;
  actor: string;
  timestamp: string;
  ip?: string;
}

export interface StorageStat {
  usedMb: number;
  totalMb: number;
}
