import { isDatabaseEnabled } from "./env";
import { isExpired } from "./format";
import {
  bloodToDb,
  reminderTypeToDb,
  toAudit,
  toMedicine,
  toMember,
  toRecord,
  toReminder,
} from "./mappers";
import { prisma } from "./prisma";
import { db, logAudit as logAuditMem, uid } from "./store";
import type {
  AuditLogEntry,
  FamilyMember,
  MedicalRecord,
  Medicine,
  Reminder,
} from "./types";

/**
 * Data-access layer for the app's collections. When a database is configured
 * (`DATABASE_URL` present) every call is backed by Prisma/Supabase and therefore
 * persists across restarts; otherwise it falls back to the in-memory demo store.
 */

// ---------------------------------------------------------------------------
// Workspace resolution. This app models a single shared family vault; the
// seeded user owns it. Returning a stable user keeps the seeded demo data
// visible while persisting every change to the database.
// ---------------------------------------------------------------------------

const WORKSPACE_EMAIL = "aarav@medvault.ai";

async function workspaceUserId(): Promise<string> {
  const user = await prisma.user.upsert({
    where: { email: WORKSPACE_EMAIL },
    update: {},
    create: { email: WORKSPACE_EMAIL, name: "Aarav Sharma", plan: "premium" },
  });
  return user.id;
}

async function auditActor(): Promise<string> {
  return WORKSPACE_EMAIL;
}

async function writeAudit(action: string, target: string): Promise<void> {
  const userId = await workspaceUserId();
  await prisma.auditLog.create({
    data: { userId, action, target, actor: await auditActor() },
  });
}

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------

export async function listMembers(): Promise<FamilyMember[]> {
  if (!isDatabaseEnabled()) return db().members;
  const userId = await workspaceUserId();
  const rows = await prisma.familyMember.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toMember);
}

export async function getMember(id: string): Promise<FamilyMember | null> {
  if (!isDatabaseEnabled()) return db().members.find((m) => m.id === id) ?? null;
  const row = await prisma.familyMember.findUnique({ where: { id } });
  return row ? toMember(row) : null;
}

export async function createMember(input: FamilyMember): Promise<FamilyMember> {
  if (!isDatabaseEnabled()) {
    db().members.push(input);
    logAuditMem("Member added", input.name);
    return input;
  }
  const userId = await workspaceUserId();
  const row = await prisma.familyMember.create({
    data: {
      userId,
      name: input.name,
      relationship: input.relationship,
      dateOfBirth: new Date(input.dateOfBirth),
      gender: input.gender,
      bloodGroup: bloodToDb(input.bloodGroup),
      photoUrl: input.photoUrl,
      conditions: input.conditions,
      allergies: input.allergies,
      emergencyContactName: input.emergencyContactName,
      emergencyContactPhone: input.emergencyContactPhone,
      heightCm: input.heightCm,
      weightKg: input.weightKg,
    },
  });
  await writeAudit("Member added", row.name);
  return toMember(row);
}

export async function updateMember(
  id: string,
  patch: Partial<FamilyMember>,
): Promise<FamilyMember | null> {
  if (!isDatabaseEnabled()) {
    const member = db().members.find((m) => m.id === id);
    if (!member) return null;
    Object.assign(member, patch, { id });
    logAuditMem("Member updated", member.name);
    return member;
  }
  const existing = await prisma.familyMember.findUnique({ where: { id } });
  if (!existing) return null;
  const row = await prisma.familyMember.update({
    where: { id },
    data: {
      name: patch.name,
      relationship: patch.relationship,
      dateOfBirth: patch.dateOfBirth ? new Date(patch.dateOfBirth) : undefined,
      gender: patch.gender,
      bloodGroup: patch.bloodGroup ? bloodToDb(patch.bloodGroup) : undefined,
      photoUrl: patch.photoUrl,
      conditions: patch.conditions,
      allergies: patch.allergies,
      emergencyContactName: patch.emergencyContactName,
      emergencyContactPhone: patch.emergencyContactPhone,
      heightCm: patch.heightCm,
      weightKg: patch.weightKg,
    },
  });
  await writeAudit("Member updated", row.name);
  return toMember(row);
}

export async function deleteMember(id: string): Promise<void> {
  if (!isDatabaseEnabled()) {
    const data = db();
    const member = data.members.find((m) => m.id === id);
    data.members = data.members.filter((m) => m.id !== id);
    data.records = data.records.filter((r) => r.memberId !== id);
    data.medicines = data.medicines.filter((m) => m.memberId !== id);
    data.reminders = data.reminders.filter((r) => r.memberId !== id);
    if (member) logAuditMem("Member deleted", member.name);
    return;
  }
  const existing = await prisma.familyMember.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.familyMember.delete({ where: { id } }); // cascades records/medicines/reminders
  await writeAudit("Member deleted", existing.name);
}

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export async function listRecords(memberId?: string): Promise<MedicalRecord[]> {
  if (!isDatabaseEnabled()) {
    const items = memberId
      ? db().records.filter((r) => r.memberId === memberId)
      : db().records;
    return [...items].sort((a, b) => b.date.localeCompare(a.date));
  }
  const memberIds = await workspaceMemberIds();
  const rows = await prisma.medicalRecord.findMany({
    where: memberId ? { memberId } : { memberId: { in: memberIds } },
    orderBy: { date: "desc" },
  });
  return rows.map(toRecord);
}

export async function createRecord(input: MedicalRecord): Promise<MedicalRecord> {
  if (!isDatabaseEnabled()) {
    db().records.push(input);
    logAuditMem("Report uploaded", input.title);
    return input;
  }
  const row = await prisma.medicalRecord.create({
    data: {
      memberId: input.memberId,
      title: input.title,
      category: input.category,
      date: new Date(input.date),
      doctorName: input.doctorName,
      hospital: input.hospital,
      diagnosis: input.diagnosis,
      medicines: input.medicines ?? [],
      notes: input.notes,
      fileUrl: input.fileUrl,
      fileType: input.fileType,
      tags: input.tags,
    },
  });
  await writeAudit("Report uploaded", row.title);
  return toRecord(row);
}

export async function updateRecord(
  id: string,
  patch: Partial<MedicalRecord>,
): Promise<MedicalRecord | null> {
  if (!isDatabaseEnabled()) {
    const record = db().records.find((r) => r.id === id);
    if (!record) return null;
    Object.assign(record, patch, { id });
    logAuditMem("Report updated", record.title);
    return record;
  }
  const existing = await prisma.medicalRecord.findUnique({ where: { id } });
  if (!existing) return null;
  const row = await prisma.medicalRecord.update({
    where: { id },
    data: {
      title: patch.title,
      category: patch.category,
      date: patch.date ? new Date(patch.date) : undefined,
      doctorName: patch.doctorName,
      hospital: patch.hospital,
      diagnosis: patch.diagnosis,
      medicines: patch.medicines,
      notes: patch.notes,
      fileUrl: patch.fileUrl,
      fileType: patch.fileType,
      tags: patch.tags,
    },
  });
  await writeAudit("Report updated", row.title);
  return toRecord(row);
}

export async function deleteRecord(id: string): Promise<void> {
  if (!isDatabaseEnabled()) {
    const data = db();
    const record = data.records.find((r) => r.id === id);
    data.records = data.records.filter((r) => r.id !== id);
    if (record) logAuditMem("Report deleted", record.title);
    return;
  }
  const existing = await prisma.medicalRecord.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.medicalRecord.delete({ where: { id } });
  await writeAudit("Report deleted", existing.title);
}

// ---------------------------------------------------------------------------
// Medicines
// ---------------------------------------------------------------------------

export async function listMedicines(memberId?: string): Promise<Medicine[]> {
  if (!isDatabaseEnabled()) {
    return memberId
      ? db().medicines.filter((m) => m.memberId === memberId)
      : db().medicines;
  }
  const memberIds = await workspaceMemberIds();
  const rows = await prisma.medicine.findMany({
    where: memberId ? { memberId } : { memberId: { in: memberIds } },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toMedicine);
}

export async function createMedicine(input: Medicine): Promise<Medicine> {
  if (!isDatabaseEnabled()) {
    db().medicines.push(input);
    logAuditMem("Medicine added", input.name);
    return input;
  }
  const row = await prisma.medicine.create({
    data: {
      memberId: input.memberId,
      name: input.name,
      dosage: input.dosage,
      schedule: input.schedule,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      expiryDate: input.expiryDate ? new Date(input.expiryDate) : undefined,
      reminderEnabled: input.reminderEnabled,
      notes: input.notes,
    },
  });
  await writeAudit("Medicine added", row.name);
  return toMedicine(row);
}

export async function updateMedicine(
  id: string,
  patch: Partial<Medicine>,
): Promise<Medicine | null> {
  if (!isDatabaseEnabled()) {
    const medicine = db().medicines.find((m) => m.id === id);
    if (!medicine) return null;
    Object.assign(medicine, patch, { id });
    logAuditMem("Medicine updated", medicine.name);
    return medicine;
  }
  const existing = await prisma.medicine.findUnique({ where: { id } });
  if (!existing) return null;
  const row = await prisma.medicine.update({
    where: { id },
    data: {
      name: patch.name,
      dosage: patch.dosage,
      schedule: patch.schedule,
      startDate: patch.startDate ? new Date(patch.startDate) : undefined,
      endDate: patch.endDate ? new Date(patch.endDate) : undefined,
      expiryDate: patch.expiryDate ? new Date(patch.expiryDate) : undefined,
      reminderEnabled: patch.reminderEnabled,
      notes: patch.notes,
    },
  });
  await writeAudit("Medicine updated", row.name);
  return toMedicine(row);
}

export async function deleteMedicine(id: string): Promise<void> {
  if (!isDatabaseEnabled()) {
    const data = db();
    const medicine = data.medicines.find((m) => m.id === id);
    data.medicines = data.medicines.filter((m) => m.id !== id);
    if (medicine) logAuditMem("Medicine deleted", medicine.name);
    return;
  }
  const existing = await prisma.medicine.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.medicine.delete({ where: { id } });
  await writeAudit("Medicine deleted", existing.name);
}

// ---------------------------------------------------------------------------
// Reminders
// ---------------------------------------------------------------------------

export async function listReminders(memberId?: string): Promise<Reminder[]> {
  if (!isDatabaseEnabled()) {
    const items = memberId
      ? db().reminders.filter((r) => r.memberId === memberId)
      : db().reminders;
    return [...items].sort((a, b) => a.dateTime.localeCompare(b.dateTime));
  }
  const memberIds = await workspaceMemberIds();
  const rows = await prisma.reminder.findMany({
    where: memberId ? { memberId } : { memberId: { in: memberIds } },
    orderBy: { dateTime: "asc" },
  });
  return rows.map(toReminder);
}

export async function createReminder(input: Reminder): Promise<Reminder> {
  if (!isDatabaseEnabled()) {
    db().reminders.push(input);
    logAuditMem("Reminder created", input.title);
    return input;
  }
  const row = await prisma.reminder.create({
    data: {
      memberId: input.memberId,
      type: reminderTypeToDb(input.type),
      title: input.title,
      dateTime: new Date(input.dateTime),
      notes: input.notes,
      channels: input.channels,
      completed: input.completed,
    },
  });
  await writeAudit("Reminder created", row.title);
  return toReminder(row);
}

export async function updateReminder(
  id: string,
  patch: Partial<Reminder>,
): Promise<Reminder | null> {
  if (!isDatabaseEnabled()) {
    const reminder = db().reminders.find((r) => r.id === id);
    if (!reminder) return null;
    Object.assign(reminder, patch, { id });
    return reminder;
  }
  const existing = await prisma.reminder.findUnique({ where: { id } });
  if (!existing) return null;
  const row = await prisma.reminder.update({
    where: { id },
    data: {
      type: patch.type ? reminderTypeToDb(patch.type) : undefined,
      title: patch.title,
      dateTime: patch.dateTime ? new Date(patch.dateTime) : undefined,
      notes: patch.notes,
      channels: patch.channels,
      completed: patch.completed,
    },
  });
  return toReminder(row);
}

export async function deleteReminder(id: string): Promise<void> {
  if (!isDatabaseEnabled()) {
    const data = db();
    const reminder = data.reminders.find((r) => r.id === id);
    data.reminders = data.reminders.filter((r) => r.id !== id);
    if (reminder) logAuditMem("Reminder deleted", reminder.title);
    return;
  }
  const existing = await prisma.reminder.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.reminder.delete({ where: { id } });
  await writeAudit("Reminder deleted", existing.title);
}

// ---------------------------------------------------------------------------
// Audit + stats + emergency
// ---------------------------------------------------------------------------

export async function listAudit(): Promise<AuditLogEntry[]> {
  if (!isDatabaseEnabled()) return db().audit;
  const userId = await workspaceUserId();
  const rows = await prisma.auditLog.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
  });
  return rows.map(toAudit);
}

export interface Stats {
  members: number;
  records: number;
  medicines: number;
  upcomingReminders: number;
  expiredMedicines: number;
  storage: { usedMb: number; totalMb: number };
}

export async function getStats(): Promise<Stats> {
  if (!isDatabaseEnabled()) {
    const data = db();
    return {
      members: data.members.length,
      records: data.records.length,
      medicines: data.medicines.length,
      upcomingReminders: data.reminders.filter(
        (r) => !r.completed && new Date(r.dateTime).getTime() > Date.now(),
      ).length,
      expiredMedicines: data.medicines.filter((m) => isExpired(m.expiryDate))
        .length,
      storage: data.storage,
    };
  }
  const [members, medicines, reminders] = await Promise.all([
    listMembers(),
    listMedicines(),
    listReminders(),
  ]);
  const records = await listRecords();
  return {
    members: members.length,
    records: records.length,
    medicines: medicines.length,
    upcomingReminders: reminders.filter(
      (r) => !r.completed && new Date(r.dateTime).getTime() > Date.now(),
    ).length,
    expiredMedicines: medicines.filter((m) => isExpired(m.expiryDate)).length,
    storage: db().storage,
  };
}

async function workspaceMemberIds(): Promise<string[]> {
  const userId = await workspaceUserId();
  const rows = await prisma.familyMember.findMany({
    where: { userId },
    select: { id: true },
  });
  return rows.map((r) => r.id);
}

export function newId(prefix: string): string {
  return uid(prefix);
}
