import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { db, logAudit, uid } from "@/lib/store";
import type { Medicine } from "@/lib/types";

export const GET = withErrorHandling(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");
  let medicines = db().medicines;
  if (memberId) medicines = medicines.filter((m) => m.memberId === memberId);
  return NextResponse.json(medicines);
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = await parseJsonBody<Partial<Medicine>>(req);
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
  db().medicines.push(medicine);
  logAudit("Medicine added", medicine.name);
  return NextResponse.json(medicine, { status: 201 });
});
