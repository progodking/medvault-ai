import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { createMember, listMembers, newId } from "@/lib/repo";
import type { FamilyMember } from "@/lib/types";

export const GET = withErrorHandling(async () => {
  return NextResponse.json(await listMembers());
});

export const POST = withErrorHandling(async (req: Request) => {
  const body = await parseJsonBody<Partial<FamilyMember>>(req);
  const member: FamilyMember = {
    id: newId("m"),
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
  return NextResponse.json(await createMember(member), { status: 201 });
});
