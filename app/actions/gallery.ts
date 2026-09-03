"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { isDatabaseConfigured, uploadPhoto } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { normalizeText, safeExtension } from "@/lib/sanitize";
import { GALLERY } from "@/lib/constants";
import { formatBytes } from "@/lib/utils";
import type { ActionState } from "@/lib/types";

const metaSchema = z.object({
  uploaderName: z.string().trim().max(80).optional().default(""),
  caption: z.string().trim().max(240).optional().default(""),
});

/**
 * Guest photo upload.
 *
 * Type and size are checked on the server against the real File, not against
 * whatever the client claimed. Uploads land as `pending` and are invisible
 * until the couple approve them, because an open upload box on a public URL
 * is an open upload box.
 */
export async function submitPhotos(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success", message: "Thank you. Your photographs are with the couple." };
  }

  const ip = clientIp(await headers());
  const limit = await rateLimit(`upload:${ip}`, 8, 60 * 10);
  if (!limit.allowed) {
    return {
      status: "error",
      message: "That is a lot of uploading at once. Please wait a few minutes and continue.",
    };
  }

  const parsed = metaSchema.safeParse({
    uploaderName: formData.get("uploaderName") ?? "",
    caption: formData.get("caption") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }

  const files = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) {
    return { status: "error", message: "Please choose at least one photograph." };
  }

  if (files.length > GALLERY.maxFilesPerUpload) {
    return {
      status: "error",
      message: `Please upload up to ${GALLERY.maxFilesPerUpload} photographs at a time.`,
    };
  }

  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      message: "Uploads are not switched on yet. Please try again after the wedding.",
    };
  }

  const uploaderName = parsed.data.uploaderName ? normalizeText(parsed.data.uploaderName) : null;
  const caption = parsed.data.caption ? normalizeText(parsed.data.caption) : null;

  let uploaded = 0;
  const rejected: string[] = [];

  for (const file of files) {
    // Widened deliberately: acceptedTypes is a const tuple, and file.type is
    // whatever the browser reported, so this is a membership test rather
    // than a type narrowing.
    if (!(GALLERY.acceptedTypes as readonly string[]).includes(file.type)) {
      rejected.push(`${file.name} is not a photograph we can accept.`);
      continue;
    }
    if (file.size > GALLERY.maxUploadBytes) {
      rejected.push(
        `${file.name} is ${formatBytes(file.size)}, over the ${formatBytes(GALLERY.maxUploadBytes)} limit.`,
      );
      continue;
    }

    const result = await uploadPhoto({
      file,
      extension: safeExtension(file.name),
      uploaderName,
      caption,
    });

    if (result.ok) uploaded += 1;
    else rejected.push(`${file.name} could not be saved.`);
  }

  revalidatePath("/admin/photos");

  if (uploaded === 0) {
    return {
      status: "error",
      message: rejected[0] ?? "Nothing could be uploaded. Please try again.",
    };
  }

  const noun = uploaded === 1 ? "photograph" : "photographs";
  const tail = rejected.length > 0 ? ` ${rejected.length} could not be accepted.` : "";

  return {
    status: "success",
    message: `Thank you. ${uploaded} ${noun} received and waiting to be approved.${tail}`,
  };
}
