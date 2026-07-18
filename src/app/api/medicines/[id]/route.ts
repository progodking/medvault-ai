import { NextResponse } from "next/server";

import { db, logAudit } from "@/lib/store";
import type { Medicine } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const data = db();
  const idx = data.medicines.findIndex((m) => m.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = (await req.json()) as Partial<Medicine>;
  data.medicines[idx] = { ...data.medicines[idx], ...body, id };
  logAudit("Medicine updated", data.medicines[idx].name);
  return NextResponse.json(data.medicines[idx]);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const data = db();
  const medicine = data.medicines.find((m) => m.id === id);
  data.medicines = data.medicines.filter((m) => m.id !== id);
  if (medicine) logAudit("Medicine deleted", medicine.name);
  return NextResponse.json({ ok: true });
}
