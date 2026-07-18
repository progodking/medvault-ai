import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { createReminder, listReminders, newId } from "@/lib/repo";
import type { Reminder } from "@/lib/types";

export const GET = withErrorHandling(async (req: Request) => {
  const memberId = new URL(req.url).searchParams.get("memberId") ?? undefined;
  return NextResponse.json(await listReminders(memberId));
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = await parseJsonBody<Partial<Reminder>>(req);
  const reminder: Reminder = {
    id: newId("rem"),
    memberId: body.memberId ?? "",
    type: body.type ?? "Medicine",
    title: body.title ?? "Reminder",
    dateTime: body.dateTime ?? new Date().toISOString(),
    notes: body.notes,
    channels: body.channels ?? ["push"],
    completed: false,
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json(await createReminder(reminder), { status: 201 });
});
