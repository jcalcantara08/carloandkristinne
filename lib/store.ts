import "server-only";

import { createAdminClient, isDatabaseConfigured } from "@/lib/supabase/admin";
import { GALLERY } from "@/lib/constants";
import type {
  GuestbookEntry,
  ModerationStatus,
  Photo,
  Rsvp,
  RsvpGuest,
} from "@/lib/types";

/**
 * The single data-access layer. Nothing else in the app talks to Supabase.
 *
 * Every read degrades to an empty result when the database is not
 * configured, so the site renders correctly before Supabase is wired up.
 * Writes report that plainly instead of pretending to succeed.
 */

export const PHOTO_BUCKET = "guest-photos";

export type WriteResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

const notConfigured: WriteResult = { ok: false, reason: "not-configured" };
const failed: WriteResult = { ok: false, reason: "failed" };

export { isDatabaseConfigured };

/* =========================
   RSVPs
   ========================= */

type RsvpRow = {
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

export async function listRsvps(): Promise<Rsvp[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[store] listRsvps failed:", error.message);
    return [];
  }
  return (data as RsvpRow[]).map(toRsvp);
}

export async function rsvpTotals(): Promise<{
  responses: number;
  attending: number;
  declined: number;
  headcount: number;
}> {
  const rsvps = await listRsvps();
  const attendingRows = rsvps.filter((r) => r.attending === "yes");
  return {
    responses: rsvps.length,
    attending: attendingRows.length,
    declined: rsvps.length - attendingRows.length,
    headcount: attendingRows.reduce((sum, r) => sum + r.partySize, 0),
  };
}

export async function deleteRsvp(id: string): Promise<WriteResult> {
  const supabase = createAdminClient();
  if (!supabase) return notConfigured;
  const { error } = await supabase.from("rsvps").delete().eq("id", id);
  if (error) {
    console.error("[store] deleteRsvp failed:", error.message);
    return failed;
  }
  return { ok: true };
}

/* =========================
   Guestbook
   ========================= */

type GuestbookRow = {
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
): Promise<GuestbookEntry[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  let query = supabase.from("guestbook").select("*").order("created_at", { ascending: false });
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

type PhotoRow = {
  id: string;
  created_at: string;
  storage_path: string;
  uploader_name: string | null;
  caption: string | null;
  status: ModerationStatus;
  width: number | null;
  height: number | null;
};

function publicUrlFor(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
}

function toPhoto(row: PhotoRow): Photo {
  return {
    id: row.id,
    createdAt: row.created_at,
    storagePath: row.storage_path,
    publicUrl: publicUrlFor(row.storage_path),
    uploaderName: row.uploader_name,
    caption: row.caption,
    status: row.status,
    width: row.width,
    height: row.height,
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
): Promise<Photo[]> {
  const supabase = createAdminClient();
  if (!supabase) return [];

  let query = supabase.from("photos").select("*").order("created_at", { ascending: false });
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

export async function deletePhoto(id: string): Promise<WriteResult> {
  const supabase = createAdminClient();
  if (!supabase) return notConfigured;

  const { data, error: readError } = await supabase
    .from("photos")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (readError || !data) {
    console.error("[store] deletePhoto lookup failed:", readError?.message);
    return failed;
  }

  await supabase.storage.from(PHOTO_BUCKET).remove([(data as { storage_path: string }).storage_path]);
  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) {
    console.error("[store] deletePhoto failed:", error.message);
    return failed;
  }
  return { ok: true };
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
