import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { deleteRecord, updateRecord } from "@/lib/repo";
import type { MedicalRecord } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export const PUT = withErrorHandling(async (req: Request, { params }: Params) => {
  const { id } = await params;
  const body = await parseJsonBody<Partial<MedicalRecord>>(req);
  const record = await updateRecord(id, body);
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(record);
});

export const DELETE = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  await deleteRecord(id);
  return NextResponse.json({ ok: true });
});
