import Image from "next/image";
import Link from "next/link";
import { requireAuth } from "@/lib/admin-guard";
import { Card } from "@/components/ui/Card";
import { listTrash, TRASH_DAYS } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { emptyRecycleBin } from "@/app/admin/(dashboard)/actions";
import { ShelfActions } from "@/app/admin/(dashboard)/shelf-controls";
import { ConfirmButton } from "@/app/admin/(dashboard)/confirm-button";

const KIND = { rsvps: "Reply", guestbook: "Message", photos: "Photograph" } as const;
const BACK = { rsvps: "/admin/rsvps", guestbook: "/admin/guestbook", photos: "/admin/photos" } as const;

/**
 * Everything the couple have deleted, in one place, with the day it goes for
 * good. Restore puts it back where it came from; Delete for good removes it
 * now. The daily purge (api/cron/purge) does the rest after TRASH_DAYS.
 */
export default async function RecycleBinPage() {
  await requireAuth();

  const items = await listTrash();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-display-md">Recycle bin</h2>
          <p className="mt-2 text-sm text-brand-ink/70">
            Deleted replies, messages and photographs wait here for {TRASH_DAYS} days. Restore
            anything you did not mean to delete. After {TRASH_DAYS} days it is removed for good,
            file and all.
          </p>
        </div>

        {items.length > 0 ? (
          <form action={emptyRecycleBin}>
            <ConfirmButton
              className="btn-outline shrink-0 px-5 py-2.5 text-xs"
              message={`Empty the recycle bin? All ${items.length} items are removed permanently. There is no way back after this.`}
            >
              Empty the bin
            </ConfirmButton>
          </form>
        ) : null}
      </div>

      {items.length === 0 ? (
        <Card className="text-center">
          <p className="font-display text-display-md">The bin is empty</p>
          <p className="mt-3 text-sm text-brand-ink/70">
            Delete a reply, a message or a photograph and it lands here first.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={`${item.table}-${item.id}`}>
              <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {item.imageUrl ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-brand-line bg-brand-paper-200">
                    <Image src={item.imageUrl} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                ) : null}

                <div className="min-w-0 flex-1">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-eyebrow text-brand-ink/60">
                    {KIND[item.table]}
                  </p>
                  <p className="mt-1 font-display text-lg text-brand-ink">{item.title}</p>
                  <p className="mt-0.5 truncate text-sm text-brand-ink/70">{item.detail}</p>
                  <p className="mt-1 text-xs text-brand-ink/60">
                    Deleted {formatDateTime(item.deletedAt)}.{" "}
                    {item.daysLeft === 0
                      ? "Goes for good at the next purge."
                      : `Goes for good in ${item.daysLeft} ${item.daysLeft === 1 ? "day" : "days"}.`}{" "}
                    <Link href={`${BACK[item.table]}?view=trash`} className="underline underline-offset-4">
                      See it in its list
                    </Link>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <ShelfActions table={item.table} id={item.id} view="trash" />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
