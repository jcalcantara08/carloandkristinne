import Link from "next/link";
import { cn } from "@/lib/utils";
import type { RecordTable, RecordView } from "@/lib/types";
import {
  archiveRecord,
  deleteRecordForGood,
  restoreRecord,
  trashRecord,
} from "@/app/admin/(dashboard)/actions";
import { ConfirmButton } from "@/app/admin/(dashboard)/confirm-button";

/**
 * The shared pieces of the three-shelf pattern (active, archived, recycle
 * bin), used by replies, messages and photographs so all three behave the
 * same way. Modelled on the Centennial Events Hall dashboard.
 */

export type ListView = Exclude<RecordView, "all">;

export function readView(value: string | undefined): ListView {
  return value === "archived" || value === "trash" ? value : "active";
}

const quiet =
  "inline-flex min-h-[44px] items-center px-2 text-xs font-medium text-brand-ink/60 underline underline-offset-4 transition-colors duration-200 hover:text-brand-steel-500";

/** Active / Archived / Recycle bin chips above a list. */
export function ViewChips({
  base,
  view,
  counts,
}: {
  base: string;
  view: ListView;
  counts: Record<ListView, number>;
}) {
  const chips: { key: ListView; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "archived", label: "Archived" },
    { key: "trash", label: "Recycle bin" },
  ];
  return (
    <nav aria-label="Which records to show" className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={chip.key === "active" ? base : `${base}?view=${chip.key}`}
          aria-current={chip.key === view ? "page" : undefined}
          className={cn(
            "inline-flex min-h-[36px] items-center gap-2 rounded-full border px-4 text-xs font-medium transition-colors duration-200",
            chip.key === view
              ? "border-brand-steel-600 bg-brand-steel-100 text-brand-steel-600"
              : "border-brand-line text-brand-ink/70 hover:border-brand-steel-600/50 hover:text-brand-ink",
          )}
        >
          {chip.label}
          <span className="tabular-nums text-brand-ink/50">{counts[chip.key]}</span>
        </Link>
      ))}
    </nav>
  );
}

function ShelfForm({
  action,
  table,
  id,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  table: RecordTable;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      {children}
    </form>
  );
}

/**
 * The right buttons for the shelf a record is on.
 * Active: Archive, Delete (to the bin). Archived: Restore, Delete.
 * Recycle bin: Restore, Delete for good.
 */
export function ShelfActions({ table, id, view }: { table: RecordTable; id: string; view: ListView }) {
  if (view === "trash") {
    return (
      <>
        <ShelfForm action={restoreRecord} table={table} id={id}>
          <button type="submit" className="btn-outline px-4 py-2 text-xs">Restore</button>
        </ShelfForm>
        <ShelfForm action={deleteRecordForGood} table={table} id={id}>
          <ConfirmButton
            className={quiet}
            message="This removes it permanently. There is no way back after this. Continue?"
          >
            Delete for good
          </ConfirmButton>
        </ShelfForm>
      </>
    );
  }
  if (view === "archived") {
    return (
      <>
        <ShelfForm action={restoreRecord} table={table} id={id}>
          <button type="submit" className="btn-outline px-4 py-2 text-xs">Restore</button>
        </ShelfForm>
        <ShelfForm action={trashRecord} table={table} id={id}>
          <button type="submit" className={quiet}>Delete</button>
        </ShelfForm>
      </>
    );
  }
  return (
    <>
      <ShelfForm action={archiveRecord} table={table} id={id}>
        <button type="submit" className="btn-outline px-4 py-2 text-xs">Archive</button>
      </ShelfForm>
      <ShelfForm action={trashRecord} table={table} id={id}>
        <button type="submit" className={quiet}>Delete</button>
      </ShelfForm>
    </>
  );
}

/** One line explaining the shelf the list is showing. */
export function ViewNote({ view, trashDays }: { view: ListView; trashDays: number }) {
  if (view === "archived") {
    return (
      <p className="text-sm text-brand-ink/70">
        Archived records are kept for good but hidden from the working list and the public site.
        Restore brings one back.
      </p>
    );
  }
  if (view === "trash") {
    return (
      <p className="text-sm text-brand-ink/70">
        Anything here is removed for good {trashDays} days after it was deleted. Restore it before
        then, or delete it for good now.
      </p>
    );
  }
  return null;
}
