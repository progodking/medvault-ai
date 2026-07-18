import {
  auditLogs as seedAudit,
  emergencyCards as seedEmergency,
  familyMembers as seedMembers,
  medicalRecords as seedRecords,
  medicines as seedMedicines,
  reminders as seedReminders,
  storageStat as seedStorage,
} from "./mock-data";
import type {
  AuditLogEntry,
  EmergencyCard,
  FamilyMember,
  MedicalRecord,
  Medicine,
  Reminder,
  StorageStat,
} from "./types";

/**
 * Module-level mutable store that backs the API routes in demo mode. It is
 * seeded from the mock dataset and persists for the lifetime of the server
 * process. Swap these functions for Prisma/Supabase queries in production.
 */
type DB = {
  members: FamilyMember[];
  records: MedicalRecord[];
  medicines: Medicine[];
  reminders: Reminder[];
  emergency: EmergencyCard[];
  audit: AuditLogEntry[];
  storage: StorageStat;
};

const g = globalThis as unknown as { __medvaultDb?: DB };

function seed(): DB {
  return {
    members: structuredClone(seedMembers),
    records: structuredClone(seedRecords),
    medicines: structuredClone(seedMedicines),
    reminders: structuredClone(seedReminders),
    emergency: structuredClone(seedEmergency),
    audit: structuredClone(seedAudit),
    storage: structuredClone(seedStorage),
  };
}

export function db(): DB {
  if (!g.__medvaultDb) g.__medvaultDb = seed();
  return g.__medvaultDb;
}

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function logAudit(action: string, target: string) {
  db().audit.unshift({
    id: uid("a"),
    action,
    target,
    actor: "aarav@medvault.ai",
    timestamp: new Date().toISOString(),
    ip: "103.21.44.12",
  });
}
