import { NextResponse } from "next/server";

import { withErrorHandling } from "@/lib/http";
import { db, resolveShareLink } from "@/lib/store";
import { isExpired } from "@/lib/format";

type Params = { params: Promise<{ id: string }> };

// The `id` segment is an opaque, time-limited share token — not a member id —
// so the public emergency card cannot be enumerated by guessing member ids.
export const GET = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { id: token } = await params;
  const link = resolveShareLink(token);
  if (!link)
    return NextResponse.json(
      { error: "This emergency link is invalid or has expired." },
      { status: 404 },
    );

  const data = db();
  const member = data.members.find((m) => m.id === link.memberId);
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const currentMedicines = data.medicines
    .filter((m) => m.memberId === member.id && !isExpired(m.expiryDate))
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
