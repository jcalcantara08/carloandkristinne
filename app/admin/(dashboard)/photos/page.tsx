import Image from "next/image";
import { requireAuth } from "@/lib/admin-guard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listPhotos } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { moderatePhoto, removePhoto } from "@/app/admin/(dashboard)/actions";
import type { Photo } from "@/lib/types";

function PhotoCard({ photo }: { photo: Photo }) {
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

      <div className="mt-4 flex flex-wrap gap-2 border-t border-brand-line pt-4">
        {photo.status !== "approved" ? (
          <form action={moderatePhoto}>
            <input type="hidden" name="id" value={photo.id} />
            <input type="hidden" name="status" value="approved" />
            <button type="submit" className="btn-outline px-4 py-2 text-xs">
              Publish
            </button>
          </form>
        ) : null}

        {photo.status !== "hidden" ? (
          <form action={moderatePhoto}>
            <input type="hidden" name="id" value={photo.id} />
            <input type="hidden" name="status" value="hidden" />
            <button type="submit" className="btn-outline px-4 py-2 text-xs">
              Hide
            </button>
          </form>
        ) : null}

        <form action={removePhoto}>
          <input type="hidden" name="id" value={photo.id} />
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center px-2 text-xs font-medium text-brand-ink/60 underline underline-offset-4 transition-colors duration-200 hover:text-brand-violet-500"
          >
            Delete
          </button>
        </form>
      </div>
    </Card>
  );
}

export default async function AdminPhotosPage() {
  await requireAuth();

  const photos = await listPhotos("all");
  const pending = photos.filter((photo) => photo.status === "pending");
  const rest = photos.filter((photo) => photo.status !== "pending");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-display-md">Photographs</h2>
        <p className="mt-2 text-sm text-brand-ink/70">
          Uploads are invisible on the public album until you publish them. Deleting removes the
          file from storage as well as the record.
        </p>
      </div>

      <section>
        <h3 className="eyebrow">Waiting for you ({pending.length})</h3>
        {pending.length === 0 ? (
          <Card className="mt-4 text-center text-sm text-brand-ink/70">Nothing waiting.</Card>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pending.map((photo) => (
              <li key={photo.id}>
                <PhotoCard photo={photo} />
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
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((photo) => (
              <li key={photo.id}>
                <PhotoCard photo={photo} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
