"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAuth } from "@/lib/admin-guard";
import {
  deleteForGood,
  listTrash,
  setGuestbookStatus,
  setPhotoStatus,
  setRecordShelf,
  writeAudit,
} from "@/lib/store";
import type { RecordTable } from "@/lib/types";

/**
 * Every admin mutation. requireAuth() is the first line of each one, without
 * exception, because a Server Action is a public HTTP endpoint whether or not
 * any UI links to it.
 *
 * Nothing here deletes a record outright. Delete moves it to the recycle bin;
 * only "Delete for good" (from the bin) and the daily purge remove rows.
 *
 * Every destructive action writes an audit row: who, what, when.
 */

const idSchema = z.string().uuid();
const statusSchema = z.enum(["pending", "approved", "hidden"]);
const tableSchema = z.enum(["rsvps", "guestbook", "photos"]);

const PATHS: Record<RecordTable, string[]> = {
  rsvps: ["/admin/rsvps", "/admin"],
  guestbook: ["/admin/guestbook", "/guestbook", "/", "/admin"],
  photos: ["/admin/photos", "/gallery", "/", "/admin"],
};

function revalidateFor(table: RecordTable) {
  for (const path of PATHS[table]) revalidatePath(path);
  revalidatePath("/admin/recycle-bin");
}

export async function moderateGuestbook(formData: FormData): Promise<void> {
  await requireAuth();

  const id = idSchema.safeParse(formData.get("id"));
  const status = statusSchema.safeParse(formData.get("status"));
  if (!id.success || !status.success) return;

  await setGuestbookStatus(id.data, status.data);
  await writeAudit("guestbook.status", `${id.data} set to ${status.data}`);
  revalidateFor("guestbook");
}

export async function moderatePhoto(formData: FormData): Promise<void> {
  await requireAuth();

  const id = idSchema.safeParse(formData.get("id"));
  const status = statusSchema.safeParse(formData.get("status"));
  if (!id.success || !status.success) return;

  await setPhotoStatus(id.data, status.data);
  await writeAudit("photo.status", `${id.data} set to ${status.data}`);
  revalidateFor("photos");
}

/* =========================
   The three shelves
   ========================= */

async function shelve(formData: FormData, shelf: "archive" | "trash" | "restore"): Promise<void> {
  await requireAuth();

  const table = tableSchema.safeParse(formData.get("table"));
  const id = idSchema.safeParse(formData.get("id"));
  if (!table.success || !id.success) return;

  await setRecordShelf(table.data, id.data, shelf);
  await writeAudit(`${table.data}.${shelf}`, id.data);
  revalidateFor(table.data);
}

/** Keeps the record for good, hidden from the working views and the site. */
export async function archiveRecord(formData: FormData): Promise<void> {
  await shelve(formData, "archive");
}

/** Moves the record to the recycle bin, where it waits 14 days. */
export async function trashRecord(formData: FormData): Promise<void> {
  await shelve(formData, "trash");
}

/** Back to the active shelf, from either the archive or the bin. */
export async function restoreRecord(formData: FormData): Promise<void> {
  await shelve(formData, "restore");
}

/** Removes one record permanently. Only reachable from the recycle bin. */
export async function deleteRecordForGood(formData: FormData): Promise<void> {
  await requireAuth();

  const table = tableSchema.safeParse(formData.get("table"));
  const id = idSchema.safeParse(formData.get("id"));
  if (!table.success || !id.success) return;

  await deleteForGood(table.data, id.data);
  await writeAudit(`${table.data}.delete`, id.data);
  revalidateFor(table.data);
}

/** Removes everything in the recycle bin permanently, now, not in 14 days. */
export async function emptyRecycleBin(): Promise<void> {
  await requireAuth();

  const items = await listTrash();
  for (const item of items) await deleteForGood(item.table, item.id);
  await writeAudit("recycle-bin.empty", `${items.length} removed`);

  revalidateFor("rsvps");
  revalidateFor("guestbook");
  revalidateFor("photos");
  redirect("/admin/recycle-bin");
}
