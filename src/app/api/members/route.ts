import { NextResponse } from "next/server";

import { addItem } from "@/lib/api-crud";
import { db, uid } from "@/lib/store";
import type { FamilyMember } from "@/lib/types";

export async function GET() {
  return NextResponse.json(db().members);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<FamilyMember>;
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
}
