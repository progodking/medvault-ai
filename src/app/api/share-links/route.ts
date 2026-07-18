import { NextResponse } from "next/server";

import { withErrorHandling } from "@/lib/http";
import { createShareLink, db } from "@/lib/store";
import { parseAndValidate, shareLinkCreateSchema } from "@/lib/validation";

/**
 * Mint a share token for a member's emergency card. This route is
 * authentication-protected by the middleware (only `/api/emergency/*` is
 * public), so only a signed-in owner can create shareable links.
 */
export const POST = withErrorHandling(async (req: Request) => {
  const { memberId } = await parseAndValidate(req, shareLinkCreateSchema);
  const member = db().members.find((m) => m.id === memberId);
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const link = createShareLink(memberId);
  return NextResponse.json(
    { token: link.token, expiresAt: link.expiresAt },
    { status: 201 },
  );
});
