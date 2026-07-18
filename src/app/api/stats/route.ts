import { NextResponse } from "next/server";

import { db } from "@/lib/store";
import { isExpired } from "@/lib/format";

export async function GET() {
  const data = db();
  const upcomingReminders = data.reminders.filter(
    (r) => !r.completed && new Date(r.dateTime).getTime() > Date.now(),
  ).length;
  const expiredMedicines = data.medicines.filter((m) =>
    isExpired(m.expiryDate),
  ).length;

  return NextResponse.json({
    members: data.members.length,
    records: data.records.length,
    medicines: data.medicines.length,
    upcomingReminders,
    expiredMedicines,
    storage: data.storage,
  });
}
