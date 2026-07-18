import { NextResponse } from "next/server";

import { db } from "@/lib/store";
import { isExpired } from "@/lib/format";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const data = db();
  const member = data.members.find((m) => m.id === id);
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const currentMedicines = data.medicines
    .filter((m) => m.memberId === id && !isExpired(m.expiryDate))
    .map((m) => `${m.name} ${m.dosage}`);

  return NextResponse.json({
    memberId: member.id,
    name: member.name,
    age: member.dateOfBirth,
    bloodGroup: member.bloodGroup,
    allergies: member.allergies,
    conditions: member.conditions,
    currentMedicines,
    emergencyContactName: member.emergencyContactName,
    emergencyContactPhone: member.emergencyContactPhone,
  });
}
