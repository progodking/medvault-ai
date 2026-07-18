import { NextResponse } from "next/server";

import { addItem, queryByMember } from "@/lib/api-crud";
import { db, uid } from "@/lib/store";
import type { Medicine } from "@/lib/types";

export async function GET(req: Request) {
  return NextResponse.json(queryByMember(db().medicines, req));
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Medicine>;
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
}
