import { NextResponse } from "next/server";

import { addItem, queryByMember } from "@/lib/api-crud";
import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { db, uid } from "@/lib/store";
import type { Medicine } from "@/lib/types";
import { medicineInputSchema, validate } from "@/lib/validation";

export const GET = withErrorHandling(async (req: Request) => {
  return NextResponse.json(queryByMember(db().medicines, req));
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = validate(medicineInputSchema, await parseJsonBody<unknown>(req));
  const medicine: Medicine = {
    id: uid("med"),
    memberId: body.memberId ?? "",
    name: body.name ?? "Medicine",
    dosage: body.dosage ?? "",
    schedule: body.schedule ?? [],
    startDate: body.startDate ?? new Date().toISOString().slice(0, 10),
    endDate: body.endDate,
    reminderEnabled: body.reminderEnabled ?? false,
    notes: body.notes,
    expiryDate: body.expiryDate,
    createdAt: new Date().toISOString(),
  };
  return addItem(db().medicines, medicine, {
    action: "Medicine added",
    target: medicine.name,
  });
});
