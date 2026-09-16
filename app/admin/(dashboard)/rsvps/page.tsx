import { requireAuth } from "@/lib/admin-guard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listRsvps, rsvpTotals } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { removeRsvp } from "@/app/admin/(dashboard)/actions";

export default async function AdminRsvpsPage() {
  await requireAuth();

  const [rsvps, totals] = await Promise.all([listRsvps(), rsvpTotals()]);

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

      {rsvps.length === 0 ? (
        <Card className="text-center">
          <p className="font-display text-display-md">No replies yet</p>
          <p className="mt-3 text-sm text-brand-ink/70">
            They appear here the moment somebody submits the form.
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

                <div className="mt-5 border-t border-brand-line pt-4">
                  <form action={removeRsvp}>
                    <input type="hidden" name="id" value={rsvp.id} />
                    <button
                      type="submit"
                      className="text-xs font-medium text-brand-ink/60 underline underline-offset-4 transition-colors duration-200 hover:text-brand-steel-500"
                    >
                      Delete this reply
                    </button>
                  </form>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
