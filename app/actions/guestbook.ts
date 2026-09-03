"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createGuestbookEntry, isDatabaseConfigured } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { normalizeMultiline, normalizeText } from "@/lib/sanitize";
import type { ActionState } from "@/lib/types";

const schema = z.object({
  name: z.string().trim().min(2, "Please give a name so they know who wrote it.").max(80),
  message: z
    .string()
    .trim()
    .min(4, "A few more words, please.")
    .max(800, "Please keep it under 800 characters."),
});

export async function submitGuestbook(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success", message: "Thank you. Your message is with the couple." };
  }

  const ip = clientIp(await headers());
  const limit = await rateLimit(`guestbook:${ip}`, 5, 60 * 10);
  if (!limit.allowed) {
    return {
      status: "error",
      message: "You have left a few already. Give it a few minutes and try again.",
    };
  }

  const parsed = schema.safeParse({
    name: formData.get("name"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }

  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      message: "The guestbook is not switched on yet. Please try again soon.",
    };
  }

  const result = await createGuestbookEntry({
    name: normalizeText(parsed.data.name),
    message: normalizeMultiline(parsed.data.message),
  });

  if (!result.ok) {
    return {
      status: "error",
      message: "Something went wrong and your message was not saved. Please try again.",
    };
  }

  revalidatePath("/admin/guestbook");

  return {
    status: "success",
    message:
      "Thank you. Messages are read before they go up, so it will appear on the wall shortly.",
  };
}
