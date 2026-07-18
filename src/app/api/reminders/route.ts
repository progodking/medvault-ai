import { NextResponse } from "next/server";

import { addItem, queryByMember } from "@/lib/api-crud";
import { db, uid } from "@/lib/store";
import type { Reminder } from "@/lib/types";

export async function GET(req: Request) {
  const reminders = queryByMember(db().reminders, req, (a, b) =>
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
  return addItem(db().reminders, reminder, {
    action: "Reminder created",
    target: reminder.title,
  });
}
