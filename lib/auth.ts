/**
 * Owner-only admin session.
 *
 * There is no user table on this site: the only people who log in are the
 * couple and Erick. A signed cookie is the right size of tool for that.
 *
 * Web Crypto only, so this module is importable from middleware on the
 * Edge runtime. It fails closed: a missing secret throws at first use
 * rather than degrading to a default password.
 */

export const SESSION_COOKIE = "ck_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. Refusing to start an auth path without it.`);
  }
  return value;
}

/** True when both admin secrets are configured. Used to render a helpful
 *  "not configured yet" screen instead of a 500 during initial setup. */
export function isAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

async function key(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(requiredEnv("ADMIN_SESSION_SECRET")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;

export async function createSessionToken(): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = String(expires);
  const signature = await crypto.subtle.sign("HMAC", await key(), new TextEncoder().encode(payload));
  return `${payload}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!/^\d+$/.test(payload)) return false;

  let valid = false;
  try {
    valid = await crypto.subtle.verify(
      "HMAC",
      await key(),
      fromBase64Url(signature) as unknown as BufferSource,
      new TextEncoder().encode(payload),
    );
  } catch {
    return false;
  }

  if (!valid) return false;
  return Number(payload) > Math.floor(Date.now() / 1000);
}

/** Constant-time comparison. Never use === on a secret: it leaks by timing. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function checkPassword(input: string): boolean {
  return safeEqual(input, requiredEnv("ADMIN_PASSWORD"));
}
