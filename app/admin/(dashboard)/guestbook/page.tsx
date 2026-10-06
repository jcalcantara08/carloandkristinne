import { requireAuth } from "@/lib/admin-guard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listGuestbook, TRASH_DAYS } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { moderateGuestbook } from "@/app/admin/(dashboard)/actions";
import {
  ShelfActions,
  ViewChips,
  ViewNote,
  readView,
  type ListView,
} from "@/app/admin/(dashboard)/shelf-controls";
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

function EntryCard({ entry, view }: { entry: GuestbookEntry; view: ListView }) {
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

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-brand-line pt-4">
        {view === "active" ? (
          <>
            {entry.status !== "hidden" ? (
              <StatusButton id={entry.id} status="hidden" label="Hide" />
            ) : null}
            {entry.status === "hidden" ? (
              <StatusButton id={entry.id} status="approved" label="Show again" />
            ) : null}
          </>
        ) : null}
        <ShelfActions table="guestbook" id={entry.id} view={view} />
      </div>
    </Card>
  );
}

export default async function AdminGuestbookPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  await requireAuth();

  const view = readView((await searchParams).view);
  const [active, archived, trash] = await Promise.all([
    listGuestbook("all", undefined, "active"),
    listGuestbook("all", undefined, "archived"),
    listGuestbook("all", undefined, "trash"),
  ]);
  const entries = view === "active" ? active : view === "archived" ? archived : trash;
  const rest = entries;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-display-md">Messages</h2>
        <p className="mt-2 text-sm text-brand-ink/70">
          Every message goes on the public wall the moment it is sent. Hide takes one down; Delete moves it to the recycle bin.
        </p>
      </div>

      <div className="space-y-3">
        <ViewChips
          base="/admin/guestbook"
          view={view}
          counts={{ active: active.length, archived: archived.length, trash: trash.length }}
        />
        <ViewNote view={view} trashDays={TRASH_DAYS} />
      </div>

      <section>
        <h3 className="eyebrow">
          {view === "active"
            ? `On the wall (${rest.length})`
            : view === "archived"
              ? `Archived (${rest.length})`
              : `In the recycle bin (${rest.length})`}
        </h3>
        {rest.length === 0 ? (
          <Card className="mt-4 text-center text-sm text-brand-ink/70">Nothing here yet.</Card>
        ) : (
          <ul className="mt-4 space-y-4">
            {rest.map((entry) => (
              <li key={entry.id}>
                <EntryCard entry={entry} view={view} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
