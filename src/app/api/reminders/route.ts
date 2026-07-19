import { NextResponse } from "next/server";

import { addItem, queryByMember } from "@/lib/api-crud";
import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { db, uid } from "@/lib/store";
import type { Reminder } from "@/lib/types";
import { reminderInputSchema, validate } from "@/lib/validation";

export const GET = withErrorHandling(async (req: Request) => {
  const reminders = queryByMember(db().reminders, req, (a, b) =>
    a.dateTime.localeCompare(b.dateTime),
  );
  return NextResponse.json(reminders);
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = validate(reminderInputSchema, await parseJsonBody<unknown>(req));
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
});
