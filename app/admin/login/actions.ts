"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_HINT_COOKIE,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  checkPassword,
  createSessionToken,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import type { ActionState } from "@/lib/types";

/**
 * Sign in.
 *
 * Rate limited hard, because a single shared password with unlimited attempts
 * is a brute-force invitation. Five tries per fifteen minutes, per IP.
 */
export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ip = clientIp(await headers());
  const limit = await rateLimit(`login:${ip}`, 5, 60 * 15);

  if (!limit.allowed) {
    return {
      status: "error",
      message: `Too many attempts. Try again in about ${Math.ceil(limit.resetInSeconds / 60)} minutes.`,
    };
  }

  const password = String(formData.get("password") ?? "");
  const requested = String(formData.get("next") ?? "/admin");
  // Only ever redirect within the admin area. Never trust the parameter.
  const next = requested.startsWith("/admin") ? requested : "/admin";

  let ok = false;
  try {
    ok = checkPassword(password);
  } catch {
    return {
      status: "error",
      message: "The admin area is not configured. Set ADMIN_PASSWORD and redeploy.",
    };
  }

  if (!ok) {
    // Deliberately unspecific.
    return { status: "error", message: "That password is not right." };
  }

  const token = await createSessionToken();
  const store = await cookies();

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  // The hint is deliberately readable by the page. See lib/auth.ts.
  store.set(ADMIN_HINT_COOKIE, "1", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect(next);
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(ADMIN_HINT_COOKIE);
  redirect("/admin/login");
}
