import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { deleteReminder, updateReminder } from "@/lib/repo";
import type { Reminder } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export const PUT = withErrorHandling(async (req: Request, { params }: Params) => {
  const { id } = await params;
  const body = await parseJsonBody<Partial<Reminder>>(req);
  const reminder = await updateReminder(id, body);
  if (!reminder) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(reminder);
});

export const DELETE = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  await deleteReminder(id);
  return NextResponse.json({ ok: true });
});
