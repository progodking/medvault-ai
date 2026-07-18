import { NextResponse } from "next/server";

import { withErrorHandling } from "@/lib/http";
import { getStats } from "@/lib/repo";

export const GET = withErrorHandling(async () => {
  return NextResponse.json(await getStats());
});
