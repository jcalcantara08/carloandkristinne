"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAuth } from "@/lib/admin-guard";
import { updateRsvp, writeAudit } from "@/lib/store";
import { normalizeEmail, normalizeMultiline, normalizePhone, normalizeText } from "@/lib/sanitize";

/**
 * The couple's edit of a reply (Erick, 10 October 2026: "how are they gonna
 * change anything?"). requireAuth() first, as for every admin action. The
 * rules follow the guest form, except the party may go up to 20 (the
 * database limit), because the couple may seat a family the form would cap.
 */
const schema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(120),
  email: z.union([z.string().trim().email(), z.literal("")]),
  phone: z.union([z.string().trim().min(7).max(24), z.literal("")]),
  attending: z.enum(["yes", "no"]),
  partySize: z.coerce.number().int().min(1).max(20),
  guestNames: z.string().trim().max(1200).optional().default(""),
  dietary: z.string().trim().max(400).optional().default(""),
  songRequest: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().max(1200).optional().default(""),
});

export async function saveRsvpEdit(formData: FormData): Promise<void> {
  await requireAuth();

  const parsed = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    attending: formData.get("attending"),
    partySize: formData.get("partySize") ?? 1,
    guestNames: formData.get("guestNames") ?? "",
    dietary: formData.get("dietary") ?? "",
    songRequest: formData.get("songRequest") ?? "",
    message: formData.get("message") ?? "",
  });

  const id = String(formData.get("id") ?? "");
  if (!parsed.success) {
    const fields = Object.keys(z.flattenError(parsed.error).fieldErrors).join(", ");
    redirect(`/admin/rsvps/${encodeURIComponent(id)}?error=${encodeURIComponent(fields || "form")}`);
  }

  const input = parsed.data;
  const guests = normalizeMultiline(input.guestNames)
    .split("\n")
    .map((line) => normalizeText(line))
    .filter(Boolean)
    .slice(0, 19)
    .map((guestName) => ({ name: guestName, isChild: false }));

  const result = await updateRsvp(input.id, {
    name: normalizeText(input.name),
    email: input.email ? normalizeEmail(input.email) : null,
    phone: input.phone ? normalizePhone(input.phone) : null,
    attending: input.attending,
    partySize: input.partySize,
    guests,
    dietary: input.dietary ? normalizeMultiline(input.dietary) : null,
    songRequest: input.songRequest ? normalizeText(input.songRequest) : null,
    message: input.message ? normalizeMultiline(input.message) : null,
  });

  if (!result.ok) {
    redirect(`/admin/rsvps/${encodeURIComponent(input.id)}?error=save`);
  }

  await writeAudit("rsvp.edit", `${normalizeText(input.name)}, ${input.attending === "yes" ? `coming (${input.partySize})` : "not coming"}`);
  for (const path of ["/admin/rsvps", "/admin", "/rsvp", "/guest-list"]) revalidatePath(path);
  redirect("/admin/rsvps?saved=1");
}
