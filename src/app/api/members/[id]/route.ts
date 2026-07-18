import { NextResponse } from "next/server";

import { deleteItem, updateItem } from "@/lib/api-crud";
import { db, logAudit } from "@/lib/store";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const member = db().members.find((m) => m.id === id);
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  return updateItem(db().members, id, req, (member) =>
    logAudit("Member updated", member.name),
  );
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const data = db();
  return deleteItem(data.members, id, (member) => {
    data.records = data.records.filter((r) => r.memberId !== id);
    data.medicines = data.medicines.filter((m) => m.memberId !== id);
    data.reminders = data.reminders.filter((r) => r.memberId !== id);
    logAudit("Member deleted", member.name);
  });
}
