/**
 * Rate limiting, keyed by IP.
 *
 * Upstash Redis in production when the two env vars are set, an in-memory
 * map otherwise. The in-memory fallback is per serverless instance and is
 * therefore weak, which is fine for dev and acceptable for a site whose
 * whole audience is 100 invited guests. It is stated plainly here rather
 * than pretended away.
 */

type Bucket = { count: number; resetAt: number };

const memory = new Map<string, Bucket>();

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
};

async function upstash(command: (string | number)[]): Promise<unknown> {
  const response = await fetch(`${UPSTASH_URL}/${command.map(encodeURIComponent).join("/")}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Upstash responded ${response.status}`);
  const data = (await response.json()) as { result: unknown };
  return data.result;
}

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const namespaced = `rl:${key}`;

  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const count = Number(await upstash(["INCR", namespaced]));
      if (count === 1) await upstash(["EXPIRE", namespaced, windowSeconds]);
      const ttl = Number(await upstash(["TTL", namespaced]));
      return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
        resetInSeconds: ttl > 0 ? ttl : windowSeconds,
      };
    } catch {
      // Never fail a guest's RSVP because the rate limiter is down.
      // Fall through to the in-memory bucket.
    }
  }

  const now = Date.now();
  const bucket = memory.get(namespaced);

  if (!bucket || bucket.resetAt <= now) {
    memory.set(namespaced, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: limit - 1, resetInSeconds: windowSeconds };
  }

  bucket.count += 1;
  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    resetInSeconds: Math.ceil((bucket.resetAt - now) / 1000),
  };
}

/** Best-effort client IP from the proxy headers Vercel sets. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
