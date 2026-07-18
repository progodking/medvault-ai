import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { db, logAudit } from "@/lib/store";
import type { Reminder } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export const PUT = withErrorHandling(async (req: Request, { params }: Params) => {
  const { id } = await params;
  const data = db();
  const idx = data.reminders.findIndex((r) => r.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await parseJsonBody<Partial<Reminder>>(req);
  data.reminders[idx] = { ...data.reminders[idx], ...body, id };
  return NextResponse.json(data.reminders[idx]);
});

export const DELETE = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  const data = db();
  const reminder = data.reminders.find((r) => r.id === id);
  data.reminders = data.reminders.filter((r) => r.id !== id);
  if (reminder) logAudit("Reminder deleted", reminder.title);
  return NextResponse.json({ ok: true });
});
