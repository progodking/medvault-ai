import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { db, logAudit, uid } from "@/lib/store";
import type { FamilyMember } from "@/lib/types";

export const GET = withErrorHandling(async () => {
  return NextResponse.json(db().members);
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = await parseJsonBody<Partial<FamilyMember>>(req);
  const member: FamilyMember = {
    id: uid("m"),
    name: body.name ?? "Unnamed",
    relationship: body.relationship ?? "Other",
    dateOfBirth: body.dateOfBirth ?? new Date().toISOString().slice(0, 10),
    gender: body.gender ?? "Other",
    bloodGroup: body.bloodGroup ?? "O+",
    photoUrl: body.photoUrl,
    conditions: body.conditions ?? [],
    allergies: body.allergies ?? [],
    emergencyContactName: body.emergencyContactName ?? "",
    emergencyContactPhone: body.emergencyContactPhone ?? "",
    heightCm: body.heightCm,
    weightKg: body.weightKg,
    createdAt: new Date().toISOString(),
  };
  db().members.push(member);
  logAudit("Member added", member.name);
  return NextResponse.json(member, { status: 201 });
});
