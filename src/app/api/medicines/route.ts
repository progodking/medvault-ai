import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { createMedicine, listMedicines, newId } from "@/lib/repo";
import type { Medicine } from "@/lib/types";

export const GET = withErrorHandling(async (req: Request) => {
  const memberId = new URL(req.url).searchParams.get("memberId") ?? undefined;
  return NextResponse.json(await listMedicines(memberId));
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = await parseJsonBody<Partial<Medicine>>(req);
  const medicine: Medicine = {
    id: newId("med"),
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
  return NextResponse.json(await createMedicine(medicine), { status: 201 });
});
