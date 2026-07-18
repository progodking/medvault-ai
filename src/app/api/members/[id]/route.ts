import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { db, logAudit } from "@/lib/store";
import type { FamilyMember } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export const GET = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  const member = db().members.find((m) => m.id === id);
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
});

export const PUT = withErrorHandling(async (req: Request, { params }: Params) => {
  const { id } = await params;
  const data = db();
  const idx = data.members.findIndex((m) => m.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await parseJsonBody<Partial<FamilyMember>>(req);
  data.members[idx] = { ...data.members[idx], ...body, id };
  logAudit("Member updated", data.members[idx].name);
  return NextResponse.json(data.members[idx]);
});

export const DELETE = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  const data = db();
  const member = data.members.find((m) => m.id === id);
  data.members = data.members.filter((m) => m.id !== id);
  data.records = data.records.filter((r) => r.memberId !== id);
  data.medicines = data.medicines.filter((r) => r.memberId !== id);
  data.reminders = data.reminders.filter((r) => r.memberId !== id);
  if (member) logAudit("Member deleted", member.name);
  return NextResponse.json({ ok: true });
});
