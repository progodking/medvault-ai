import { NextResponse } from "next/server";

import { addItem } from "@/lib/api-crud";
import { withErrorHandling } from "@/lib/http";
import { db, uid } from "@/lib/store";
import type { FamilyMember } from "@/lib/types";
import { memberCreateSchema, parseAndValidate } from "@/lib/validation";

export const GET = withErrorHandling(async () => {
  return NextResponse.json(db().members);
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = await parseAndValidate(req, memberCreateSchema);
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
  return addItem(db().members, member, {
    action: "Member added",
    target: member.name,
  });
});
