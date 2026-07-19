import { NextResponse } from "next/server";

import { addItem, queryByMember } from "@/lib/api-crud";
import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { db, uid } from "@/lib/store";
import type { MedicalRecord } from "@/lib/types";
import { recordInputSchema, validate } from "@/lib/validation";

export const GET = withErrorHandling(async (req: Request) => {
  const records = queryByMember(db().records, req, (a, b) =>
    b.date.localeCompare(a.date),
  );
  return NextResponse.json(records);
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = validate(recordInputSchema, await parseJsonBody<unknown>(req));
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
  return addItem(db().records, record, {
    action: "Report uploaded",
    target: record.title,
  });
});
