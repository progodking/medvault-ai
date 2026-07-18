import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { isClerkEnabled } from "@/lib/env";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/(.*)"]);

// The emergency card is intentionally shareable and must stay reachable without
// a session, so it is excluded from the API auth requirement.
const isPublicApiRoute = createRouteMatcher(["/api/emergency(.*)"]);

const withClerk = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req) && !isPublicApiRoute(req)) {
    await auth.protect();
  }
});

// In demo mode (no Clerk keys) routes are open so the app can be explored.
export default isClerkEnabled()
  ? withClerk
  : function middleware() {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ico|webp|woff2?|ttf|map)).*)",
    "/(api|trpc)(.*)",
  ],
};
