import type {
  FamilyMember as PrismaFamilyMember,
  MedicalRecord as PrismaMedicalRecord,
  Medicine as PrismaMedicine,
  Reminder as PrismaReminder,
  AuditLog as PrismaAuditLog,
  Prisma,
} from "@prisma/client";

import type {
  AuditLogEntry,
  BloodGroup,
  FamilyMember,
  Frequency,
  MedicalRecord,
  Medicine,
  Reminder,
  ReminderType,
} from "./types";

/**
 * Conversions between the app's string-union / ISO-string types and Prisma's
 * enum identifiers and `Date` values. Kept pure and dependency-free so they can
 * be unit tested without a database.
 */

export const BLOOD_TO_DB = {
  "A+": "A_POS",
  "A-": "A_NEG",
  "B+": "B_POS",
  "B-": "B_NEG",
  "AB+": "AB_POS",
  "AB-": "AB_NEG",
  "O+": "O_POS",
  "O-": "O_NEG",
} as const satisfies Record<BloodGroup, string>;

const BLOOD_FROM_DB: Record<string, BloodGroup> = Object.fromEntries(
  Object.entries(BLOOD_TO_DB).map(([app, dbValue]) => [dbValue, app as BloodGroup]),
);

export const bloodToDb = (b: BloodGroup) =>
  BLOOD_TO_DB[b] as Prisma.FamilyMemberCreateInput["bloodGroup"];

export const bloodFromDb = (b: string): BloodGroup => BLOOD_FROM_DB[b] ?? "O+";

export const reminderTypeToDb = (t: ReminderType) =>
  (t === "Lab Test" ? "LabTest" : t) as Prisma.ReminderCreateInput["type"];

export const reminderTypeFromDb = (t: string): ReminderType =>
  t === "LabTest" ? "Lab Test" : (t as ReminderType);

export const dateOnly = (d: Date) => d.toISOString().slice(0, 10);

export function toMember(m: PrismaFamilyMember): FamilyMember {
  return {
    id: m.id,
    name: m.name,
    relationship: m.relationship,
    dateOfBirth: dateOnly(m.dateOfBirth),
    gender: m.gender,
    bloodGroup: bloodFromDb(m.bloodGroup),
    photoUrl: m.photoUrl ?? undefined,
    conditions: m.conditions,
    allergies: m.allergies,
    emergencyContactName: m.emergencyContactName ?? "",
    emergencyContactPhone: m.emergencyContactPhone ?? "",
    heightCm: m.heightCm ?? undefined,
    weightKg: m.weightKg ?? undefined,
    createdAt: m.createdAt.toISOString(),
  };
}

export function toRecord(r: PrismaMedicalRecord): MedicalRecord {
  return {
    id: r.id,
    memberId: r.memberId,
    title: r.title,
    category: r.category,
    date: dateOnly(r.date),
    doctorName: r.doctorName ?? undefined,
    hospital: r.hospital ?? undefined,
    diagnosis: r.diagnosis ?? undefined,
    medicines: r.medicines,
    notes: r.notes ?? undefined,
    fileUrl: r.fileUrl ?? undefined,
    fileType: (r.fileType as MedicalRecord["fileType"]) ?? undefined,
    tags: r.tags,
    createdAt: r.createdAt.toISOString(),
  };
}

export function toMedicine(m: PrismaMedicine): Medicine {
  return {
    id: m.id,
    memberId: m.memberId,
    name: m.name,
    dosage: m.dosage,
    schedule: m.schedule as Frequency[],
    startDate: dateOnly(m.startDate),
    endDate: m.endDate ? dateOnly(m.endDate) : undefined,
    reminderEnabled: m.reminderEnabled,
    notes: m.notes ?? undefined,
    expiryDate: m.expiryDate ? dateOnly(m.expiryDate) : undefined,
    createdAt: m.createdAt.toISOString(),
  };
}

export function toReminder(r: PrismaReminder): Reminder {
  return {
    id: r.id,
    memberId: r.memberId,
    type: reminderTypeFromDb(r.type),
    title: r.title,
    dateTime: r.dateTime.toISOString(),
    notes: r.notes ?? undefined,
    channels: r.channels as Reminder["channels"],
    completed: r.completed,
    createdAt: r.createdAt.toISOString(),
  };
}

export function toAudit(a: PrismaAuditLog): AuditLogEntry {
  return {
    id: a.id,
    action: a.action,
    target: a.target,
    actor: a.actor,
    timestamp: a.timestamp.toISOString(),
    ip: a.ip ?? undefined,
  };
}
