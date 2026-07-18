import { NextResponse } from "next/server";

import { isExpired } from "@/lib/format";
import { withErrorHandling } from "@/lib/http";
import { getMember, listMedicines } from "@/lib/repo";

type Params = { params: Promise<{ id: string }> };

export const GET = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const currentMedicines = (await listMedicines(id))
    .filter((m) => !isExpired(m.expiryDate))
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
});
