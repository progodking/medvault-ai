import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { db, logAudit } from "@/lib/store";
import type { MedicalRecord } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export const PUT = withErrorHandling(async (req: Request, { params }: Params) => {
  const { id } = await params;
  const data = db();
  const idx = data.records.findIndex((r) => r.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await parseJsonBody<Partial<MedicalRecord>>(req);
  data.records[idx] = { ...data.records[idx], ...body, id };
  logAudit("Report updated", data.records[idx].title);
  return NextResponse.json(data.records[idx]);
});

export const DELETE = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  const data = db();
  const record = data.records.find((r) => r.id === id);
  data.records = data.records.filter((r) => r.id !== id);
  if (record) logAudit("Report deleted", record.title);
  return NextResponse.json({ ok: true });
});
