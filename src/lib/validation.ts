import { z } from "zod";

import { ApiError } from "./http";

/**
 * Server-side input validation for the API routes. Every mutating handler runs
 * its request body through one of these schemas so untrusted input is type- and
 * range-checked before it reaches the store. Schemas are non-strict: unknown
 * keys are stripped rather than rejected, which prevents mass-assignment (e.g.
 * a client cannot smuggle `id`, `createdAt` or arbitrary fields into a record)
 * while staying tolerant of extra fields older clients might send.
 */

const SHORT = 200;
const LONG = 5000;
const URLISH = 4096;

const bloodGroup = z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);
const relationship = z.enum([
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
]);
const gender = z.enum(["Male", "Female", "Other"]);
const recordCategory = z.enum([
  "Report",
  "Prescription",
  "Bill",
  "Scan",
  "Visit",
  "Vaccination",
]);
const reminderType = z.enum([
  "Medicine",
  "Appointment",
  "Lab Test",
  "Vaccination",
]);
const frequency = z.enum(["morning", "afternoon", "night"]);
const fileType = z.enum(["pdf", "image"]);
const channel = z.enum(["push", "email"]);

const shortStr = z.string().max(SHORT);
const longStr = z.string().max(LONG);
const urlStr = z.string().max(URLISH);
const stringList = z.array(z.string().max(SHORT)).max(200);
const dateStr = z.string().min(1).max(40);
const dimension = z.number().int().min(0).max(1000);

export const memberInputSchema = z.object({
  memberId: shortStr.optional(),
  name: z.string().min(1).max(SHORT).optional(),
  relationship: relationship.optional(),
  dateOfBirth: dateStr.optional(),
  gender: gender.optional(),
  bloodGroup: bloodGroup.optional(),
  photoUrl: urlStr.optional(),
  conditions: stringList.optional(),
  allergies: stringList.optional(),
  emergencyContactName: shortStr.optional(),
  emergencyContactPhone: shortStr.optional(),
  heightCm: dimension.optional(),
  weightKg: dimension.optional(),
});

export const recordInputSchema = z.object({
  memberId: shortStr.optional(),
  title: z.string().min(1).max(SHORT).optional(),
  category: recordCategory.optional(),
  date: dateStr.optional(),
  doctorName: shortStr.optional(),
  hospital: shortStr.optional(),
  diagnosis: longStr.optional(),
  medicines: stringList.optional(),
  notes: longStr.optional(),
  fileUrl: urlStr.optional(),
  fileType: fileType.optional(),
  tags: stringList.optional(),
});

export const medicineInputSchema = z.object({
  memberId: shortStr.optional(),
  name: z.string().min(1).max(SHORT).optional(),
  dosage: shortStr.optional(),
  schedule: z.array(frequency).max(10).optional(),
  startDate: dateStr.optional(),
  endDate: dateStr.optional(),
  reminderEnabled: z.boolean().optional(),
  notes: longStr.optional(),
  expiryDate: dateStr.optional(),
});

export const reminderInputSchema = z.object({
  memberId: shortStr.optional(),
  type: reminderType.optional(),
  title: z.string().min(1).max(SHORT).optional(),
  dateTime: dateStr.optional(),
  notes: longStr.optional(),
  channels: z.array(channel).max(5).optional(),
  completed: z.boolean().optional(),
});

export const aiSearchSchema = z.object({
  query: z.string().max(LONG).optional(),
  memberId: shortStr.optional(),
});

export const explainMedicineSchema = z.object({
  name: z.string().max(SHORT).optional(),
});

export const summarizeSchema = z.object({
  text: z.string().max(50_000).optional(),
  title: shortStr.optional(),
});

/**
 * Validate already-parsed JSON against a schema, throwing a 400 `ApiError`
 * (surfaced as a structured JSON response by `withErrorHandling`) on failure.
 */
export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const detail = result.error.issues
      .map((i) => `${i.path.join(".") || "body"}: ${i.message}`)
      .join("; ");
    throw new ApiError(400, `Invalid request body: ${detail}`);
  }
  return result.data;
}
