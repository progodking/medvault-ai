import { NextResponse } from "next/server";

import { withErrorHandling } from "@/lib/http";
import { db } from "@/lib/store";

export const GET = withErrorHandling(async () => {
  return NextResponse.json(db().audit);
});
