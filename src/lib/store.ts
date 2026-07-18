import { randomBytes } from "crypto";

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
  ShareLink,
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
  shareLinks: ShareLink[];
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
    shareLinks: [],
    audit: structuredClone(seedAudit),
    storage: structuredClone(seedStorage),
  };
}

const SHARE_LINK_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Mint (or reuse) an unguessable, time-limited share token for a member's
 * emergency card. Reusing a still-valid token keeps the dashboard preview, QR
 * code and shared URL in sync and avoids piling up links.
 */
export function createShareLink(memberId: string): ShareLink {
  const data = db();
  const now = Date.now();
  const existing = data.shareLinks.find(
    (l) => l.memberId === memberId && new Date(l.expiresAt).getTime() > now,
  );
  if (existing) return existing;
  const link: ShareLink = {
    token: randomBytes(24).toString("hex"),
    memberId,
    expiresAt: new Date(now + SHARE_LINK_TTL_MS).toISOString(),
    createdAt: new Date(now).toISOString(),
  };
  data.shareLinks.push(link);
  return link;
}

/** Resolve a share token to its link, or null when unknown or expired. */
export function resolveShareLink(token: string): ShareLink | null {
  const link = db().shareLinks.find((l) => l.token === token);
  if (!link) return null;
  if (new Date(link.expiresAt).getTime() <= Date.now()) return null;
  return link;
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
