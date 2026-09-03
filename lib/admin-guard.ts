import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * The real gate.
 *
 * Middleware is a redirect and improves the experience; it is not a security
 * boundary. Every Server Action and every admin route handler calls this on
 * its first line, because a Server Action is a public HTTP endpoint even when
 * nothing in the UI links to it.
 */
export async function requireAuth(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const ok = await verifySessionToken(token);
  if (!ok) {
    // Deliberately vague. An unauthenticated caller learns nothing.
    throw new Error("Not authorised.");
  }
}

export async function isSignedIn(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
