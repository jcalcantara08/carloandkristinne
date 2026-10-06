import Image from "next/image";
import { requireAuth } from "@/lib/admin-guard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listPhotos, TRASH_DAYS } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { moderatePhoto } from "@/app/admin/(dashboard)/actions";
import {
  ShelfActions,
  ViewChips,
  ViewNote,
  readView,
  type ListView,
} from "@/app/admin/(dashboard)/shelf-controls";
import type { Photo } from "@/lib/types";

function PhotoCard({ photo, view }: { photo: Photo; view: ListView }) {
  return (
    <Card className="flex h-full flex-col p-4">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-brand-line bg-brand-paper-200">
        <Image
          src={photo.publicUrl}
          alt={photo.caption ?? "Uploaded photograph awaiting review"}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="mt-4 flex-1">
        <Badge tone={photo.status}>{photo.status}</Badge>
        <p className="mt-3 text-sm text-brand-ink/80">
          {photo.uploaderName ?? "Anonymous"}
        </p>
        {photo.caption ? (
          <p className="mt-1 text-xs text-brand-ink/60">{photo.caption}</p>
        ) : null}
        <p className="mt-1 text-xs text-brand-ink/60">{formatDateTime(photo.createdAt)}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-brand-line pt-4">
        {view === "active" && photo.status === "hidden" ? (
          <form action={moderatePhoto}>
            <input type="hidden" name="id" value={photo.id} />
            <input type="hidden" name="status" value="approved" />
            <button type="submit" className="btn-outline px-4 py-2 text-xs">
              Show again
            </button>
          </form>
        ) : null}

        {view === "active" && photo.status !== "hidden" ? (
          <form action={moderatePhoto}>
            <input type="hidden" name="id" value={photo.id} />
            <input type="hidden" name="status" value="hidden" />
            <button type="submit" className="btn-outline px-4 py-2 text-xs">
              Hide
            </button>
          </form>
        ) : null}

        <ShelfActions table="photos" id={photo.id} view={view} />
      </div>
    </Card>
  );
}

export default async function AdminPhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  await requireAuth();

  const view = readView((await searchParams).view);
  const [active, archived, trash] = await Promise.all([
    listPhotos("all", "active"),
    listPhotos("all", "archived"),
    listPhotos("all", "trash"),
  ]);
  const photos = view === "active" ? active : view === "archived" ? archived : trash;
  const rest = photos;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-display-md">Gallery</h2>
        <p className="mt-2 text-sm text-brand-ink/70">
          Every upload goes into the public album the moment it is sent. Hide takes one down;
          Delete moves it to the recycle bin, and the file itself only goes when the bin is emptied.
        </p>
      </div>

      <div className="space-y-3">
        <ViewChips
          base="/admin/photos"
          view={view}
          counts={{ active: active.length, archived: archived.length, trash: trash.length }}
        />
        <ViewNote view={view} trashDays={TRASH_DAYS} />
      </div>

      <section>
        <h3 className="eyebrow">
          {view === "active"
            ? `In the album (${rest.length})`
            : view === "archived"
              ? `Archived (${rest.length})`
              : `In the recycle bin (${rest.length})`}
        </h3>
        {rest.length === 0 ? (
          <Card className="mt-4 text-center text-sm text-brand-ink/70">Nothing here yet.</Card>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((photo) => (
              <li key={photo.id}>
                <PhotoCard photo={photo} view={view} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
