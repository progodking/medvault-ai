import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { deleteMedicine, updateMedicine } from "@/lib/repo";
import type { Medicine } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export const PUT = withErrorHandling(async (req: Request, { params }: Params) => {
  const { id } = await params;
  const body = await parseJsonBody<Partial<Medicine>>(req);
  const medicine = await updateMedicine(id, body);
  if (!medicine) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(medicine);
});

export const DELETE = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  await deleteMedicine(id);
  return NextResponse.json({ ok: true });
});
