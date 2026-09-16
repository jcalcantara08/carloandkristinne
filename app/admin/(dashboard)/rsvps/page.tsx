import { requireAuth } from "@/lib/admin-guard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listRsvps, rsvpTotals, TRASH_DAYS } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import {
  ShelfActions,
  ViewChips,
  ViewNote,
  readView,
} from "@/app/admin/(dashboard)/shelf-controls";

export default async function AdminRsvpsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  await requireAuth();

  const view = readView((await searchParams).view);
  const [active, archived, trash, totals] = await Promise.all([
    listRsvps("active"),
    listRsvps("archived"),
    listRsvps("trash"),
    rsvpTotals(),
  ]);
  const rsvps = view === "active" ? active : view === "archived" ? archived : trash;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-display-md">Replies</h2>
          <p className="mt-2 text-sm text-brand-ink/70">
            {totals.responses} replies, {totals.attending} coming, {totals.declined} cannot make it.
            Confirmed headcount is {totals.headcount}.
          </p>
        </div>

        <a href="/admin/rsvps/export" className="btn-primary shrink-0 px-5 py-2.5 text-xs">
          Download CSV
        </a>
      </div>

      <ViewChips
        base="/admin/rsvps"
        view={view}
        counts={{ active: active.length, archived: archived.length, trash: trash.length }}
      />
      <ViewNote view={view} trashDays={TRASH_DAYS} />

      {rsvps.length === 0 ? (
        <Card className="text-center">
          <p className="font-display text-display-md">
            {view === "active" ? "No replies yet" : "Nothing here"}
          </p>
          <p className="mt-3 text-sm text-brand-ink/70">
            {view === "active"
              ? "They appear here the moment somebody submits the form."
              : view === "archived"
                ? "Archive a reply to keep it out of the way without losing it."
                : "Deleted replies wait here for 14 days before they go for good."}
          </p>
        </Card>
      ) : (
        <ul className="space-y-4">
          {rsvps.map((rsvp) => (
            <li key={rsvp.id}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-xl text-brand-ink">{rsvp.name}</p>
                    <p className="mt-1 text-xs text-brand-ink/60">
                      {formatDateTime(rsvp.createdAt)}
                    </p>
                  </div>
                  <Badge tone={rsvp.attending === "yes" ? "approved" : "hidden"}>
                    {rsvp.attending === "yes" ? `Coming, ${rsvp.partySize}` : "Cannot make it"}
                  </Badge>
                </div>

                <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  {rsvp.email ? (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-brand-ink/60">Email</dt>
                      <dd className="mt-0.5 break-all text-brand-ink/80">{rsvp.email}</dd>
                    </div>
                  ) : null}

                  {rsvp.phone ? (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-brand-ink/60">Phone</dt>
                      <dd className="mt-0.5 text-brand-ink/80">{rsvp.phone}</dd>
                    </div>
                  ) : null}

                  {rsvp.guests.length > 0 ? (
                    <div className="sm:col-span-2">
                      <dt className="text-xs uppercase tracking-wider text-brand-ink/60">
                        Guests
                      </dt>
                      <dd className="mt-0.5 text-brand-ink/80">
                        {rsvp.guests.map((guest) => guest.name).join(", ")}
                      </dd>
                    </div>
                  ) : null}

                  {rsvp.dietary ? (
                    <div className="sm:col-span-2">
                      <dt className="text-xs uppercase tracking-wider text-brand-ink/60">
                        Dietary
                      </dt>
                      <dd className="mt-0.5 whitespace-pre-line text-brand-ink/80">
                        {rsvp.dietary}
                      </dd>
                    </div>
                  ) : null}

                  {rsvp.songRequest ? (
                    <div className="sm:col-span-2">
                      <dt className="text-xs uppercase tracking-wider text-brand-ink/60">
                        Song request
                      </dt>
                      <dd className="mt-0.5 text-brand-ink/80">{rsvp.songRequest}</dd>
                    </div>
                  ) : null}

                  {rsvp.message ? (
                    <div className="sm:col-span-2">
                      <dt className="text-xs uppercase tracking-wider text-brand-ink/60">
                        Message
                      </dt>
                      <dd className="mt-0.5 whitespace-pre-line text-brand-ink/80">
                        {rsvp.message}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-brand-line pt-4">
                  <ShelfActions table="rsvps" id={rsvp.id} view={view} />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
