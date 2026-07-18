import { NextResponse } from "next/server";

import { db, logAudit, uid } from "@/lib/store";
import type { Reminder } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");
  let reminders = db().reminders;
  if (memberId) reminders = reminders.filter((r) => r.memberId === memberId);
  reminders = [...reminders].sort((a, b) =>
    a.dateTime.localeCompare(b.dateTime),
  );
  return NextResponse.json(reminders);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Reminder>;
  const reminder: Reminder = {
    id: uid("rem"),
    memberId: body.memberId ?? "",
    type: body.type ?? "Medicine",
    title: body.title ?? "Reminder",
    dateTime: body.dateTime ?? new Date().toISOString(),
    notes: body.notes,
    channels: body.channels ?? ["push"],
    completed: false,
    createdAt: new Date().toISOString(),
  };
  db().reminders.push(reminder);
  logAudit("Reminder created", reminder.title);
  return NextResponse.json(reminder, { status: 201 });
}
