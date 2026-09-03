"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/lib/admin-guard";
import {
  deletePhoto,
  deleteRsvp,
  setGuestbookStatus,
  setPhotoStatus,
  writeAudit,
} from "@/lib/store";

/**
 * Every admin mutation. requireAuth() is the first line of each one, without
 * exception, because a Server Action is a public HTTP endpoint whether or not
 * any UI links to it.
 *
 * Every destructive action writes an audit row: who, what, when.
 */

const idSchema = z.string().uuid();
const statusSchema = z.enum(["pending", "approved", "hidden"]);

export async function moderateGuestbook(formData: FormData): Promise<void> {
  await requireAuth();

  const id = idSchema.safeParse(formData.get("id"));
  const status = statusSchema.safeParse(formData.get("status"));
  if (!id.success || !status.success) return;

  await setGuestbookStatus(id.data, status.data);
  await writeAudit("guestbook.status", `${id.data} set to ${status.data}`);

  revalidatePath("/admin/guestbook");
  revalidatePath("/guestbook");
  revalidatePath("/");
}

export async function moderatePhoto(formData: FormData): Promise<void> {
  await requireAuth();

  const id = idSchema.safeParse(formData.get("id"));
  const status = statusSchema.safeParse(formData.get("status"));
  if (!id.success || !status.success) return;

  await setPhotoStatus(id.data, status.data);
  await writeAudit("photo.status", `${id.data} set to ${status.data}`);

  revalidatePath("/admin/photos");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function removePhoto(formData: FormData): Promise<void> {
  await requireAuth();

  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return;

  await deletePhoto(id.data);
  await writeAudit("photo.delete", id.data);

  revalidatePath("/admin/photos");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function removeRsvp(formData: FormData): Promise<void> {
  await requireAuth();

  const id = idSchema.safeParse(formData.get("id"));
  if (!id.success) return;

  await deleteRsvp(id.data);
  await writeAudit("rsvp.delete", id.data);

  revalidatePath("/admin/rsvps");
  revalidatePath("/admin");
}
