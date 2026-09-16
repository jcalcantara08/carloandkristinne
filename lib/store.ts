import "server-only";

import { createAdminClient, isDatabaseConfigured } from "@/lib/supabase/admin";
import { GALLERY } from "@/lib/constants";
import type {
  GuestbookEntry,
  ModerationStatus,
  Photo,
  RecordTable,
  RecordView,
  Rsvp,
  RsvpGuest,
  TrashItem,
} from "@/lib/types";

/**
 * The single data-access layer. Nothing else in the app talks to Supabase.
 *
 * Every read degrades to an empty result when the database is not
 * configured, so the site renders correctly before Supabase is wired up.
 * Writes report that plainly instead of pretending to succeed.
 *
 * Three shelves. Every reply, message and photograph is active, archived
 * (kept for good, hidden) or in the recycle bin (deleted_at set, purged after
 * TRASH_DAYS). The public site and the working views only ever see active
 * rows; "all" exists for exports and the purge.
 */

export const PHOTO_BUCKET = "guest-photos";
export const SITE_BUCKET = "site-assets";

/** How long a deleted record waits in the recycle bin before the purge. */
export const TRASH_DAYS = 14;

export type WriteResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

const notConfigured: WriteResult = { ok: false, reason: "not-configured" };
const failed: WriteResult = { ok: false, reason: "failed" };

export { isDatabaseConfigured };

type Flags = { archived_at: string | null; deleted_at: string | null };

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- supabase-js query builders are not generic over our row types
function applyView(query: any, view: RecordView) {
  if (view === "active") return query.is("archived_at", null).is("deleted_at", null);
  if (view === "archived") return query.not("archived_at", "is", null).is("deleted_at", null);
  if (view === "trash") return query.not("deleted_at", "is", null);
  return query;
}

/* =========================
   RSVPs
   ========================= */

type RsvpRow = Flags & {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  attending: "yes" | "no";
  party_size: number;
  guests: RsvpGuest[] | null;
  dietary: string | null;
  song_request: string | null;
  message: string | null;
};

function toRsvp(row: RsvpRow): Rsvp {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    phone: row.phone,
    attending: row.attending,
    partySize: row.party_size,
    guests: row.guests ?? [],
    dietary: row.dietary,
    songRequest: row.song_request,
    message: row.message,
    archivedAt: row.archived_at ?? null,
    deletedAt: row.deleted_at ?? null,
  };
}

export async function createRsvp(input: {
  name: string;
  email: string | null;
  phone: string | null;
  attending: "yes" | "no";
  partySize: number;
  guests: RsvpGuest[];
  dietary: string | null;
  songRequest: string | null;
  message: string | null;
}): Promise<WriteResult> {
  const supabase = createAdminClient();
  if (!supabase) return notConfigured;

  const { error } = await supabase.from("rsvps").insert({
    name: input.name,
    email: input.email,
    phone: input.phone,
    attending: input.attending,
    party_size: input.partySize,
    guests: input.guests,
    dietary: input.dietary,
    song_request: input.songRequest,
    message: input.message,
  });

  if (error) {
    console.error("[store] createRsvp failed:", error.message);
    return failed;
  }
  return { ok: true };
}

export async function listRsvps(view: RecordView = "active"): Promise<Rsvp[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  const { data, error } = await applyView(
    supabase.from("rsvps").select("*").order("created_at", { ascending: false }),
    view,
  );

  if (error) {
    console.error("[store] listRsvps failed:", error.message);
    return [];
  }
  return (data as RsvpRow[]).map(toRsvp);
}

/** Active replies only. Archived and binned replies never count towards seats. */
export async function rsvpTotals(): Promise<{
  responses: number;
  attending: number;
  declined: number;
  headcount: number;
}> {
  const rsvps = await listRsvps("active");
  const attendingRows = rsvps.filter((r) => r.attending === "yes");
  return {
    responses: rsvps.length,
    attending: attendingRows.length,
    declined: rsvps.length - attendingRows.length,
    headcount: attendingRows.reduce((sum, r) => sum + r.partySize, 0),
  };
}

/* =========================
   Guestbook
   ========================= */

type GuestbookRow = Flags & {
  id: string;
  created_at: string;
  name: string;
  message: string;
  status: ModerationStatus;
};

function toGuestbook(row: GuestbookRow): GuestbookEntry {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    message: row.message,
    status: row.status,
    archivedAt: row.archived_at ?? null,
    deletedAt: row.deleted_at ?? null,
  };
}

export async function createGuestbookEntry(input: {
  name: string;
  message: string;
}): Promise<WriteResult> {
  const supabase = createAdminClient();
  if (!supabase) return notConfigured;

  const { error } = await supabase
    .from("guestbook")
    .insert({ name: input.name, message: input.message, status: "pending" });

  if (error) {
    console.error("[store] createGuestbookEntry failed:", error.message);
    return failed;
  }
  return { ok: true };
}

export async function listGuestbook(
  status: ModerationStatus | "all" = "approved",
  limit?: number,
  view: RecordView = "active",
): Promise<GuestbookEntry[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  let query = applyView(
    supabase.from("guestbook").select("*").order("created_at", { ascending: false }),
    view,
  );
  if (status !== "all") query = query.eq("status", status);
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("[store] listGuestbook failed:", error.message);
    return [];
  }
  return (data as GuestbookRow[]).map(toGuestbook);
}

export async function setGuestbookStatus(
  id: string,
  status: ModerationStatus,
): Promise<WriteResult> {
  const supabase = createAdminClient();
  if (!supabase) return notConfigured;
  const { error } = await supabase.from("guestbook").update({ status }).eq("id", id);
  if (error) {
    console.error("[store] setGuestbookStatus failed:", error.message);
    return failed;
  }
  return { ok: true };
}

/* =========================
   Photos
   ========================= */

type PhotoRow = Flags & {
  id: string;
  created_at: string;
  storage_path: string;
  uploader_name: string | null;
  caption: string | null;
  status: ModerationStatus;
  width: number | null;
  height: number | null;
};

function publicUrlFor(bucket: string, path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

function toPhoto(row: PhotoRow): Photo {
  return {
    id: row.id,
    createdAt: row.created_at,
    storagePath: row.storage_path,
    publicUrl: publicUrlFor(PHOTO_BUCKET, row.storage_path),
    uploaderName: row.uploader_name,
    caption: row.caption,
    status: row.status,
    width: row.width,
    height: row.height,
    archivedAt: row.archived_at ?? null,
    deletedAt: row.deleted_at ?? null,
  };
}

export async function uploadPhoto(input: {
  file: File;
  extension: string;
  uploaderName: string | null;
  caption: string | null;
}): Promise<WriteResult> {
  const supabase = createAdminClient();
  if (!supabase) return notConfigured;

  if (input.file.size > GALLERY.maxUploadBytes) return failed;

  // The stem is ours, never the client's filename.
  const stem = crypto.randomUUID();
  const path = `${stem}.${input.extension}`;

  const { error: uploadError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, input.file, {
      contentType: input.file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) {
    console.error("[store] uploadPhoto storage failed:", uploadError.message);
    return failed;
  }

  const { error } = await supabase.from("photos").insert({
    storage_path: path,
    uploader_name: input.uploaderName,
    caption: input.caption,
    status: "pending",
  });

  if (error) {
    console.error("[store] uploadPhoto row failed:", error.message);
    // Do not leave an orphan object behind.
    await supabase.storage.from(PHOTO_BUCKET).remove([path]);
    return failed;
  }
  return { ok: true };
}

export async function listPhotos(
  status: ModerationStatus | "all" = "approved",
  view: RecordView = "active",
): Promise<Photo[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  let query = applyView(
    supabase.from("photos").select("*").order("created_at", { ascending: false }),
    view,
  );
  if (status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) {
    console.error("[store] listPhotos failed:", error.message);
    return [];
  }
  return (data as PhotoRow[]).map(toPhoto);
}

export async function setPhotoStatus(id: string, status: ModerationStatus): Promise<WriteResult> {
  const supabase = createAdminClient();
  if (!supabase) return notConfigured;
  const { error } = await supabase.from("photos").update({ status }).eq("id", id);
  if (error) {
    console.error("[store] setPhotoStatus failed:", error.message);
    return failed;
  }
  return { ok: true };
}

/* =========================
   The three shelves: archive, recycle bin, restore, delete for good
   ========================= */

/**
 * Archive keeps the record for good and hides it. Trash moves it to the
 * recycle bin (and clears any archive stamp, so a restore from the bin lands
 * it back on the active shelf). Restore clears both stamps.
 */
export async function setRecordShelf(
  table: RecordTable,
  id: string,
  shelf: "archive" | "trash" | "restore",
): Promise<WriteResult> {
  const supabase = createAdminClient();
  if (!supabase) return notConfigured;

  const now = new Date().toISOString();
  const patch =
    shelf === "archive"
      ? { archived_at: now }
      : shelf === "trash"
        ? { deleted_at: now, archived_at: null }
        : { archived_at: null, deleted_at: null };

  const { error } = await supabase.from(table).update(patch).eq("id", id);
  if (error) {
    console.error(`[store] setRecordShelf ${table} ${shelf} failed:`, error.message);
    return failed;
  }
  return { ok: true };
}

/**
 * Removes a row permanently. For a photograph the storage object goes too.
 * Only the recycle bin and the purge call this; nothing else deletes.
 */
export async function deleteForGood(table: RecordTable, id: string): Promise<WriteResult> {
  const supabase = createAdminClient();
  if (!supabase) return notConfigured;

  if (table === "photos") {
    const { data } = await supabase.from("photos").select("storage_path").eq("id", id).maybeSingle();
    const path = (data as { storage_path: string } | null)?.storage_path;
    if (path) await supabase.storage.from(PHOTO_BUCKET).remove([path]);
  }

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    console.error(`[store] deleteForGood ${table} failed:`, error.message);
    return failed;
  }
  return { ok: true };
}

function daysLeft(deletedAt: string, now: number): number {
  const purgeAt = new Date(deletedAt).getTime() + TRASH_DAYS * 86_400_000;
  return Math.max(0, Math.ceil((purgeAt - now) / 86_400_000));
}

/** Everything in the recycle bin, newest deletion first. */
export async function listTrash(now = Date.now()): Promise<TrashItem[]> {
  const [rsvps, entries, photos] = await Promise.all([
    listRsvps("trash"),
    listGuestbook("all", undefined, "trash"),
    listPhotos("all", "trash"),
  ]);

  const items: TrashItem[] = [
    ...rsvps.map((r) => ({
      table: "rsvps" as const,
      id: r.id,
      title: r.name,
      detail: r.attending === "yes" ? `Reply, coming (${r.partySize})` : "Reply, cannot make it",
      deletedAt: r.deletedAt ?? "",
      daysLeft: daysLeft(r.deletedAt ?? "", now),
    })),
    ...entries.map((e) => ({
      table: "guestbook" as const,
      id: e.id,
      title: e.name,
      detail: `Message: ${e.message.length > 80 ? `${e.message.slice(0, 80).trim()}...` : e.message}`,
      deletedAt: e.deletedAt ?? "",
      daysLeft: daysLeft(e.deletedAt ?? "", now),
    })),
    ...photos.map((p) => ({
      table: "photos" as const,
      id: p.id,
      title: p.uploaderName ?? "Anonymous",
      detail: p.caption ? `Photograph: ${p.caption}` : "Photograph",
      deletedAt: p.deletedAt ?? "",
      daysLeft: daysLeft(p.deletedAt ?? "", now),
      imageUrl: p.publicUrl,
    })),
  ];

  return items.sort((a, b) => b.deletedAt.localeCompare(a.deletedAt));
}

/**
 * Empties the recycle bin of anything older than TRASH_DAYS. Runs from the
 * daily cron; returns how many records were removed for good.
 */
export async function purgeTrash(now = Date.now()): Promise<number> {
  const supabase = createAdminClient();
  if (!supabase) return 0;

  const cutoff = new Date(now - TRASH_DAYS * 86_400_000).toISOString();
  let removed = 0;

  for (const table of ["rsvps", "guestbook", "photos"] as const) {
    const { data, error } = await supabase
      .from(table)
      .select("id")
      .not("deleted_at", "is", null)
      .lt("deleted_at", cutoff);
    if (error) {
      console.error(`[store] purgeTrash scan ${table} failed:`, error.message);
      continue;
    }
    for (const row of (data ?? []) as { id: string }[]) {
      const result = await deleteForGood(table, row.id);
      if (result.ok) removed += 1;
    }
  }
  return removed;
}

/* =========================
   Page content and the couple's own photographs
   ========================= */

export async function readSiteDoc<T>(key: string, fallback: T): Promise<T> {
  const supabase = createAdminClient();
  if (!supabase) return fallback;
  const { data, error } = await supabase.from("site_docs").select("data").eq("key", key).maybeSingle();
  if (error) {
    console.error("[store] readSiteDoc failed:", error.message);
    return fallback;
  }
  return ((data as { data: T } | null)?.data ?? fallback) as T;
}

export async function writeSiteDoc(key: string, data: unknown): Promise<WriteResult> {
  const supabase = createAdminClient();
  if (!supabase) return notConfigured;
  const { error } = await supabase
    .from("site_docs")
    .upsert({ key, data, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) {
    console.error("[store] writeSiteDoc failed:", error.message);
    return failed;
  }
  return { ok: true };
}

/** Uploads one of the couple's own photographs and returns its public URL. */
export async function uploadSiteAsset(input: {
  file: File;
  extension: string;
}): Promise<{ ok: true; url: string } | { ok: false; reason: "not-configured" | "failed" }> {
  const supabase = createAdminClient();
  if (!supabase) return { ok: false, reason: "not-configured" };
  if (input.file.size > GALLERY.maxUploadBytes) return { ok: false, reason: "failed" };

  const path = `${crypto.randomUUID()}.${input.extension}`;
  const { error } = await supabase.storage
    .from(SITE_BUCKET)
    .upload(path, input.file, { contentType: input.file.type, cacheControl: "31536000", upsert: false });
  if (error) {
    console.error("[store] uploadSiteAsset failed:", error.message);
    return { ok: false, reason: "failed" };
  }
  return { ok: true, url: publicUrlFor(SITE_BUCKET, path) };
}

/* =========================
   Audit trail
   Who did what, when. Written on every destructive admin action.
   ========================= */

export async function writeAudit(action: string, detail: string): Promise<void> {
  const supabase = createAdminClient();
  if (!supabase) return;
  const { error } = await supabase.from("audit_log").insert({ action, detail, actor: "admin" });
  if (error) console.error("[store] writeAudit failed:", error.message);
}

export async function listAudit(limit = 50): Promise<
  { id: string; createdAt: string; action: string; detail: string; actor: string }[]
> {
  const supabase = createAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[store] listAudit failed:", error.message);
    return [];
  }
  return (data as { id: string; created_at: string; action: string; detail: string; actor: string }[]).map(
    (row) => ({
      id: row.id,
      createdAt: row.created_at,
      action: row.action,
      detail: row.detail,
      actor: row.actor,
    }),
  );
}
