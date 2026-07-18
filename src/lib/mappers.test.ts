import { describe, expect, it } from "vitest";

import type {
  FamilyMember as PrismaFamilyMember,
  MedicalRecord as PrismaMedicalRecord,
  Medicine as PrismaMedicine,
  Reminder as PrismaReminder,
  AuditLog as PrismaAuditLog,
} from "@prisma/client";

import {
  BLOOD_TO_DB,
  bloodFromDb,
  bloodToDb,
  dateOnly,
  reminderTypeFromDb,
  reminderTypeToDb,
  toAudit,
  toMedicine,
  toMember,
  toRecord,
  toReminder,
} from "./mappers";

describe("blood group mapping", () => {
  it("round-trips every app blood group through the DB enum", () => {
    for (const app of Object.keys(BLOOD_TO_DB) as (keyof typeof BLOOD_TO_DB)[]) {
      expect(bloodFromDb(bloodToDb(app) as string)).toBe(app);
    }
  });

  it("maps known DB identifiers to symbols", () => {
    expect(bloodFromDb("O_POS")).toBe("O+");
    expect(bloodFromDb("AB_NEG")).toBe("AB-");
  });

  it("falls back to O+ for unknown values", () => {
    expect(bloodFromDb("UNKNOWN")).toBe("O+");
  });
});

describe("reminder type mapping", () => {
  it("maps the spaced Lab Test to the enum identifier and back", () => {
    expect(reminderTypeToDb("Lab Test")).toBe("LabTest");
    expect(reminderTypeFromDb("LabTest")).toBe("Lab Test");
  });

  it("passes other types through unchanged", () => {
    expect(reminderTypeToDb("Medicine")).toBe("Medicine");
    expect(reminderTypeFromDb("Appointment")).toBe("Appointment");
  });
});

describe("dateOnly", () => {
  it("returns the YYYY-MM-DD portion", () => {
    expect(dateOnly(new Date("2024-11-02T10:30:00.000Z"))).toBe("2024-11-02");
  });
});

describe("row -> app mappers", () => {
  it("maps a family member, converting dates and enums and nulls", () => {
    const row: PrismaFamilyMember = {
      id: "m1",
      userId: "u1",
      name: "Aarav",
      relationship: "Self",
      dateOfBirth: new Date("1990-04-12T00:00:00.000Z"),
      gender: "Male",
      bloodGroup: "O_POS",
      photoUrl: null,
      conditions: ["Diabetes"],
      allergies: [],
      emergencyContactName: null,
      emergencyContactPhone: null,
      heightCm: null,
      weightKg: null,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    };
    expect(toMember(row)).toEqual({
      id: "m1",
      name: "Aarav",
      relationship: "Self",
      dateOfBirth: "1990-04-12",
      gender: "Male",
      bloodGroup: "O+",
      photoUrl: undefined,
      conditions: ["Diabetes"],
      allergies: [],
      emergencyContactName: "",
      emergencyContactPhone: "",
      heightCm: undefined,
      weightKg: undefined,
      createdAt: "2024-01-01T00:00:00.000Z",
    });
  });

  it("maps a medical record", () => {
    const row: PrismaMedicalRecord = {
      id: "r1",
      memberId: "m1",
      title: "HbA1c",
      category: "Report",
      date: new Date("2024-11-02T00:00:00.000Z"),
      doctorName: "Dr. Neha",
      hospital: null,
      diagnosis: null,
      medicines: ["Metformin"],
      notes: null,
      fileUrl: null,
      fileType: null,
      tags: ["diabetes"],
      createdAt: new Date("2024-11-02T09:00:00.000Z"),
    };
    const mapped = toRecord(row);
    expect(mapped.date).toBe("2024-11-02");
    expect(mapped.hospital).toBeUndefined();
    expect(mapped.fileType).toBeUndefined();
    expect(mapped.medicines).toEqual(["Metformin"]);
  });

  it("maps a medicine with optional dates", () => {
    const row: PrismaMedicine = {
      id: "med1",
      memberId: "m1",
      name: "Metformin",
      dosage: "500mg",
      schedule: ["morning", "night"],
      startDate: new Date("2024-11-02T00:00:00.000Z"),
      endDate: null,
      expiryDate: new Date("2026-05-01T00:00:00.000Z"),
      reminderEnabled: true,
      notes: null,
      createdAt: new Date("2024-11-02T09:00:00.000Z"),
    };
    const mapped = toMedicine(row);
    expect(mapped.startDate).toBe("2024-11-02");
    expect(mapped.endDate).toBeUndefined();
    expect(mapped.expiryDate).toBe("2026-05-01");
    expect(mapped.schedule).toEqual(["morning", "night"]);
  });

  it("maps a reminder, converting the enum type", () => {
    const row: PrismaReminder = {
      id: "rem1",
      memberId: "m1",
      type: "LabTest",
      title: "Blood test",
      dateTime: new Date("2024-11-05T08:00:00.000Z"),
      notes: null,
      channels: ["push", "email"],
      completed: false,
      createdAt: new Date("2024-11-02T09:00:00.000Z"),
    };
    const mapped = toReminder(row);
    expect(mapped.type).toBe("Lab Test");
    expect(mapped.dateTime).toBe("2024-11-05T08:00:00.000Z");
    expect(mapped.channels).toEqual(["push", "email"]);
  });

  it("maps an audit log entry", () => {
    const row: PrismaAuditLog = {
      id: "a1",
      userId: "u1",
      action: "Member added",
      target: "Aarav",
      actor: "aarav@medvault.ai",
      ip: null,
      timestamp: new Date("2024-11-02T09:00:00.000Z"),
    };
    const mapped = toAudit(row);
    expect(mapped).toEqual({
      id: "a1",
      action: "Member added",
      target: "Aarav",
      actor: "aarav@medvault.ai",
      timestamp: "2024-11-02T09:00:00.000Z",
      ip: undefined,
    });
  });
});
