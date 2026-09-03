import { requireAuth } from "@/lib/admin-guard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listGuestbook } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { moderateGuestbook } from "@/app/admin/(dashboard)/actions";
import type { GuestbookEntry } from "@/lib/types";

function StatusButton({
  id,
  status,
  label,
}: {
  id: string;
  status: "approved" | "hidden" | "pending";
  label: string;
}) {
  return (
    <form action={moderateGuestbook}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className="btn-outline px-4 py-2 text-xs">
        {label}
      </button>
    </form>
  );
}

function EntryCard({ entry }: { entry: GuestbookEntry }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-xl text-brand-ink">{entry.name}</p>
          <p className="mt-1 text-xs text-brand-ink/60">{formatDateTime(entry.createdAt)}</p>
        </div>
        <Badge tone={entry.status}>{entry.status}</Badge>
      </div>

      <blockquote className="mt-4 whitespace-pre-line text-sm leading-relaxed text-brand-ink/80">
        {entry.message}
      </blockquote>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-brand-line pt-4">
        {entry.status !== "approved" ? (
          <StatusButton id={entry.id} status="approved" label="Publish" />
        ) : null}
        {entry.status !== "hidden" ? (
          <StatusButton id={entry.id} status="hidden" label="Hide" />
        ) : null}
        {entry.status !== "pending" ? (
          <StatusButton id={entry.id} status="pending" label="Back to pending" />
        ) : null}
      </div>
    </Card>
  );
}

export default async function AdminGuestbookPage() {
  await requireAuth();

  const entries = await listGuestbook("all");
  const pending = entries.filter((entry) => entry.status === "pending");
  const rest = entries.filter((entry) => entry.status !== "pending");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-display-md">Messages</h2>
        <p className="mt-2 text-sm text-brand-ink/70">
          Nothing appears on the public wall until you publish it.
        </p>
      </div>

      <section>
        <h3 className="eyebrow">Waiting for you ({pending.length})</h3>
        {pending.length === 0 ? (
          <Card className="mt-4 text-center text-sm text-brand-ink/70">
            Nothing waiting. The wall is up to date.
          </Card>
        ) : (
          <ul className="mt-4 space-y-4">
            {pending.map((entry) => (
              <li key={entry.id}>
                <EntryCard entry={entry} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="eyebrow">Everything else ({rest.length})</h3>
        {rest.length === 0 ? (
          <Card className="mt-4 text-center text-sm text-brand-ink/70">Nothing here yet.</Card>
        ) : (
          <ul className="mt-4 space-y-4">
            {rest.map((entry) => (
              <li key={entry.id}>
                <EntryCard entry={entry} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
