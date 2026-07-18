import { NextResponse } from "next/server";

import { withErrorHandling } from "@/lib/http";
import { listAudit } from "@/lib/repo";

export const GET = withErrorHandling(async () => {
  return NextResponse.json(await listAudit());
});
