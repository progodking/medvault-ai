import { NextResponse } from "next/server";

import { db, logAudit } from "@/lib/store";
import type { FamilyMember } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const member = db().members.find((m) => m.id === id);
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const data = db();
  const idx = data.members.findIndex((m) => m.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = (await req.json()) as Partial<FamilyMember>;
  data.members[idx] = { ...data.members[idx], ...body, id };
  logAudit("Member updated", data.members[idx].name);
  return NextResponse.json(data.members[idx]);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const data = db();
  const member = data.members.find((m) => m.id === id);
  data.members = data.members.filter((m) => m.id !== id);
  data.records = data.records.filter((r) => r.memberId !== id);
  data.medicines = data.medicines.filter((r) => r.memberId !== id);
  data.reminders = data.reminders.filter((r) => r.memberId !== id);
  if (member) logAudit("Member deleted", member.name);
  return NextResponse.json({ ok: true });
}
