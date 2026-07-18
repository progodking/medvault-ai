import { NextResponse } from "next/server";

import { parseJsonBody, withErrorHandling } from "@/lib/http";
import { deleteMember, getMember, updateMember } from "@/lib/repo";
import type { FamilyMember } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export const GET = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
});

export const PUT = withErrorHandling(async (req: Request, { params }: Params) => {
  const { id } = await params;
  const body = await parseJsonBody<Partial<FamilyMember>>(req);
  const member = await updateMember(id, body);
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
});

export const DELETE = withErrorHandling(async (_req: Request, { params }: Params) => {
  const { id } = await params;
  await deleteMember(id);
  return NextResponse.json({ ok: true });
});
