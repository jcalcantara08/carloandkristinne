import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Next 16 renamed the middleware file convention to `proxy`. Same behaviour,
 * clearer name: this runs at the network boundary in front of the app.
 *
 * Runs on the Edge runtime. lib/auth uses only Web Crypto, so it is compatible.
 *
 * This is a redirect for the sake of the experience, NOT a security boundary.
 * The real gate is requireAuth() inside every admin Server Action and route
 * handler (lib/admin-guard.ts).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  try {
    if (await verifySessionToken(token)) return NextResponse.next();
  } catch {
    // A missing ADMIN_SESSION_SECRET throws. Fail closed: send to login,
    // where a clear "not configured" screen explains what to set.
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  const response = NextResponse.redirect(loginUrl);
  // Clear a stale cookie so we do not bounce in a redirect loop.
  if (token) response.cookies.delete(SESSION_COOKIE);
  return response;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
