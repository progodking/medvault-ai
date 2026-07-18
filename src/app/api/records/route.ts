import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { db, logAudit, uid } from "@/lib/store";
import type { MedicalRecord } from "@/lib/types";

export const GET = withErrorHandling(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");
  let records = db().records;
  if (memberId) records = records.filter((r) => r.memberId === memberId);
  records = [...records].sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json(records);
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = await parseJsonBody<Partial<MedicalRecord>>(req);
  const record: MedicalRecord = {
    id: uid("r"),
    memberId: body.memberId ?? "",
    title: body.title ?? "Untitled record",
    category: body.category ?? "Report",
    date: body.date ?? new Date().toISOString().slice(0, 10),
    doctorName: body.doctorName,
    hospital: body.hospital,
    diagnosis: body.diagnosis,
    medicines: body.medicines ?? [],
    notes: body.notes,
    fileUrl: body.fileUrl,
    fileType: body.fileType,
    tags: body.tags ?? [],
    createdAt: new Date().toISOString(),
  };
  db().records.push(record);
  logAudit("Report uploaded", record.title);
  return NextResponse.json(record, { status: 201 });
});
