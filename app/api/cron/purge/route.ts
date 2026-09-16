import { NextResponse } from "next/server";
import { purgeTrash, writeAudit, TRASH_DAYS } from "@/lib/store";

/**
 * The daily purge. Vercel calls this on the schedule in vercel.json with
 * `Authorization: Bearer <CRON_SECRET>`; anything else is refused. It
 * removes, for good, everything that has sat in the recycle bin for more
 * than TRASH_DAYS, photographs' files included.
 *
 * Without CRON_SECRET set the route refuses every call, which is the safe
 * failure: the bin simply keeps things until the secret is set.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization") ?? "";
  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const removed = await purgeTrash();
  if (removed > 0) await writeAudit("recycle-bin.purge", `${removed} removed after ${TRASH_DAYS} days`);

  return NextResponse.json({ ok: true, removed });
}
