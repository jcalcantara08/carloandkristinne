import Link from "next/link";
import { requireAuth } from "@/lib/admin-guard";
import { Card } from "@/components/ui/Card";
import { listGuestbook, listPhotos, listTrash, rsvpTotals, TRASH_DAYS } from "@/lib/store";
import { RSVP, WEDDING_DATE_ISO, WEDDING_DAY } from "@/lib/constants";

export default async function AdminOverviewPage() {
  await requireAuth();

  const [totals, pendingMessages, pendingPhotos, approvedPhotos, trash] = await Promise.all([
    rsvpTotals(),
    listGuestbook("pending"),
    listPhotos("pending"),
    listPhotos("approved"),
    listTrash(),
  ]);

  // Unlike the public countdown, reading the clock here is correct and safe:
  // this page is never prerendered (it sits behind requireAuth, so it renders
  // per request), which means the value is computed fresh on every view.
  // eslint-disable-next-line react-hooks/purity -- dynamic route, evaluated per request
  const today = Date.now();
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(WEDDING_DATE_ISO).getTime() - today) / 86_400_000),
  );

  // Real numbers only. No decorative cards.
  const metrics = [
    { label: "Days to go", value: daysLeft, note: WEDDING_DAY.dateShort },
    {
      label: "Confirmed headcount",
      value: totals.headcount,
      note: `of ${WEDDING_DAY.guestCount} seats`,
    },
    { label: "Replies received", value: totals.responses, note: `${totals.declined} cannot make it` },
    {
      label: "Waiting for you",
      value: pendingMessages.length + pendingPhotos.length,
      note: `${pendingMessages.length} messages, ${pendingPhotos.length} photographs`,
    },
  ];

  const seatsLeft = WEDDING_DAY.guestCount - totals.headcount;

  return (
    <div className="space-y-8">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <li key={metric.label}>
            <Card className="h-full">
              <p className="text-[0.65rem] font-semibold uppercase tracking-eyebrow text-brand-ink/60">
                {metric.label}
              </p>
              <p className="mt-3 font-display text-4xl tabular-nums text-brand-ink">
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-brand-ink/60">{metric.note}</p>
            </Card>
          </li>
        ))}
      </ul>

      <Card>
        <h2 className="text-display-md">Where the headcount stands</h2>
        <p className="mt-3 text-sm leading-relaxed text-brand-ink/75">
          {totals.headcount} of {WEDDING_DAY.guestCount} seats are spoken for, which leaves{" "}
          {seatsLeft >= 0 ? seatsLeft : 0}
          {seatsLeft < 0 ? ` (you are ${Math.abs(seatsLeft)} over)` : ""}. The caterer needs the
          final number roughly two weeks before the day, and the reply deadline on the site is{" "}
          {RSVP.deadlineLabel}.
        </p>

        <div className="mt-5">
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-brand-paper-200"
            role="img"
            aria-label={`${totals.headcount} of ${WEDDING_DAY.guestCount} seats confirmed`}
          >
            <div
              className="h-full rounded-full bg-aurora transition-all duration-500 ease-expo"
              style={{
                width: `${Math.min(100, (totals.headcount / WEDDING_DAY.guestCount) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/rsvps" className="btn-primary px-5 py-2.5 text-xs">
            Open the replies
          </Link>
          <a href="/admin/rsvps/export" className="btn-outline px-5 py-2.5 text-xs">
            Download the CSV
          </a>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="text-display-md">Messages</h2>
          <p className="mt-3 text-sm text-brand-ink/75">
            {pendingMessages.length === 0
              ? "Nothing waiting. The wall is up to date."
              : `${pendingMessages.length} waiting to be approved before they appear on the wall.`}
          </p>
          <Link href="/admin/guestbook" className="btn-outline mt-5 px-5 py-2.5 text-xs">
            Review messages
          </Link>
        </Card>

        <Card>
          <h2 className="text-display-md">Photographs</h2>
          <p className="mt-3 text-sm text-brand-ink/75">
            {approvedPhotos.length} in the album.{" "}
            {pendingPhotos.length === 0
              ? "Nothing waiting."
              : `${pendingPhotos.length} waiting for you.`}
          </p>
          <Link href="/admin/photos" className="btn-outline mt-5 px-5 py-2.5 text-xs">
            Review photographs
          </Link>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="text-display-md">Edit the website</h2>
          <p className="mt-3 text-sm text-brand-ink/75">
            Every headline, paragraph, list and photograph on the public pages, editable here. Save
            publishes straight away.
          </p>
          <Link href="/admin/pages" className="btn-outline mt-5 px-5 py-2.5 text-xs">
            Open the editor
          </Link>
        </Card>

        <Card>
          <h2 className="text-display-md">Recycle bin</h2>
          <p className="mt-3 text-sm text-brand-ink/75">
            {trash.length === 0
              ? "Empty. Anything you delete waits here for "
              : `${trash.length} ${trash.length === 1 ? "item" : "items"} waiting. Each goes for good `}
            {TRASH_DAYS} days{trash.length === 0 ? " before it goes for good." : " after it was deleted."}
          </p>
          <Link href="/admin/recycle-bin" className="btn-outline mt-5 px-5 py-2.5 text-xs">
            Open the bin
          </Link>
        </Card>
      </div>
    </div>
  );
}
