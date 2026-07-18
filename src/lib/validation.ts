import { z } from "zod";

import {
  BLOOD_GROUPS,
  RECORD_CATEGORIES,
  RELATIONSHIPS,
  REMINDER_TYPES,
} from "./constants";
import { ApiError, parseJsonBody } from "./http";

/**
 * Server-side request validation. API routes accept untrusted JSON, so every
 * write endpoint parses its body through one of these schemas instead of
 * blindly casting with `as Partial<T>`. Client forms already use Zod; this
 * mirrors that on the server where it actually protects the data layer.
 */

const shortText = z.string().trim().max(200);
const longText = z.string().trim().max(5000);

export const memberCreateSchema = z.object({
  name: shortText.min(1),
  relationship: z.enum(RELATIONSHIPS).optional(),
  dateOfBirth: shortText.optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  bloodGroup: z.enum(BLOOD_GROUPS).optional(),
  photoUrl: z.url().max(2000).optional(),
  conditions: z.array(shortText).max(50).optional(),
  allergies: z.array(shortText).max(50).optional(),
  emergencyContactName: shortText.optional(),
  emergencyContactPhone: shortText.optional(),
  heightCm: z.number().int().positive().max(300).optional(),
  weightKg: z.number().int().positive().max(700).optional(),
});
export const memberUpdateSchema = memberCreateSchema.partial();

export const recordCreateSchema = z.object({
  memberId: shortText.min(1),
  title: shortText.optional(),
  category: z.enum(RECORD_CATEGORIES).optional(),
  date: shortText.optional(),
  doctorName: shortText.optional(),
  hospital: shortText.optional(),
  diagnosis: longText.optional(),
  medicines: z.array(shortText).max(50).optional(),
  notes: longText.optional(),
  fileUrl: z.url().max(2000).optional(),
  fileType: z.enum(["pdf", "image"]).optional(),
  tags: z.array(shortText).max(50).optional(),
});
export const recordUpdateSchema = recordCreateSchema.partial();

export const medicineCreateSchema = z.object({
  memberId: shortText.min(1),
  name: shortText.optional(),
  dosage: shortText.optional(),
  schedule: z.array(z.enum(["morning", "afternoon", "night"])).max(3).optional(),
  startDate: shortText.optional(),
  endDate: shortText.optional(),
  expiryDate: shortText.optional(),
  reminderEnabled: z.boolean().optional(),
  notes: longText.optional(),
});
export const medicineUpdateSchema = medicineCreateSchema.partial();

export const reminderCreateSchema = z.object({
  memberId: shortText.min(1),
  type: z.enum(REMINDER_TYPES).optional(),
  title: shortText.optional(),
  dateTime: shortText.optional(),
  notes: longText.optional(),
  channels: z.array(z.enum(["push", "email"])).max(2).optional(),
  completed: z.boolean().optional(),
});
export const reminderUpdateSchema = reminderCreateSchema.partial();

export const shareLinkCreateSchema = z.object({
  memberId: shortText.min(1),
});

export const explainMedicineSchema = z.object({
  name: shortText.min(1),
});

export const summarizeSchema = z.object({
  text: z.string().trim().min(1).max(20000),
  title: shortText.optional(),
});

export const aiSearchSchema = z.object({
  query: shortText.min(1),
  memberId: shortText.optional(),
});

/**
 * Validate already-parsed data against a schema, throwing a 400 `ApiError`
 * (handled by `withErrorHandling`) with a readable message on failure.
 */
export function validateBody<T extends z.ZodType>(
  schema: T,
  data: unknown,
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const detail = result.error.issues
      .map((i) => `${i.path.join(".") || "body"}: ${i.message}`)
      .join("; ");
    throw new ApiError(400, `Validation failed: ${detail}`);
  }
  return result.data;
}

/** Read the JSON request body and validate it against a schema. */
export async function parseAndValidate<T extends z.ZodType>(
  req: Request,
  schema: T,
): Promise<z.infer<T>> {
  const body = await parseJsonBody<unknown>(req);
  return validateBody(schema, body);
}
