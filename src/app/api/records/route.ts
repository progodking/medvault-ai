import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { createRecord, listRecords, newId } from "@/lib/repo";
import type { MedicalRecord } from "@/lib/types";

export const GET = withErrorHandling(async (req: Request) => {
  const memberId = new URL(req.url).searchParams.get("memberId") ?? undefined;
  return NextResponse.json(await listRecords(memberId));
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = await parseJsonBody<Partial<MedicalRecord>>(req);
  const record: MedicalRecord = {
    id: newId("r"),
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
  return NextResponse.json(await createRecord(record), { status: 201 });
});
