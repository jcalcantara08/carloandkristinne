"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createRsvp, isDatabaseConfigured } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { emailShell, sendMail } from "@/lib/email";
import { normalizeEmail, normalizeMultiline, normalizePhone, normalizeText } from "@/lib/sanitize";
import { RSVP } from "@/lib/constants";
import type { ActionState } from "@/lib/types";

/**
 * A Server Action is a public HTTP endpoint even though only the RSVP page
 * links to it. Everything here assumes a hostile caller: rate limit first,
 * honeypot second, zod third, sanitise fourth, then persist, then email.
 *
 * Persist before send. A Resend outage must never lose a guest's reply.
 */

const schema = z.object({
  name: z.string().trim().min(2, "Please give your full name.").max(120),
  email: z.union([z.string().trim().email("That does not look like an email address."), z.literal("")]),
  phone: z.union([z.string().trim().min(7, "That number looks too short.").max(24), z.literal("")]),
  attending: z.enum(["yes", "no"], { message: "Please choose yes or no." }),
  partySize: z.coerce
    .number()
    .int()
    .min(1, "At least one person, presumably you.")
    .max(RSVP.maxPartySize, `Please contact Erick directly for parties over ${RSVP.maxPartySize}.`),
  guestNames: z.string().trim().max(600).optional().default(""),
  dietary: z.string().trim().max(400).optional().default(""),
  songRequest: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().max(1200).optional().default(""),
});

export async function submitRsvp(_prev: ActionState, formData: FormData): Promise<ActionState> {
  // 1. Honeypot. A real guest never fills a field they cannot see.
  if (String(formData.get("website") ?? "").length > 0) {
    // Report success so a bot learns nothing, and write nothing.
    return { status: "success", message: "Thank you. Your reply has been recorded." };
  }

  // 2. Rate limit by IP.
  const ip = clientIp(await headers());
  const limit = await rateLimit(`rsvp:${ip}`, 6, 60 * 15);
  if (!limit.allowed) {
    return {
      status: "error",
      message: "That is a lot of replies from one place. Please try again in a few minutes.",
    };
  }

  // 3. Validate.
  const parsed = schema.safeParse({
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

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }

  const input = parsed.data;

  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      message:
        "Replies are not switched on yet. Please message Erick directly and he will add you to the list.",
    };
  }

  // 4. Sanitise everything that will be stored or rendered later.
  const name = normalizeText(input.name);
  const email = input.email ? normalizeEmail(input.email) : null;
  const phone = input.phone ? normalizePhone(input.phone) : null;
  const dietary = input.dietary ? normalizeMultiline(input.dietary) : null;
  const songRequest = input.songRequest ? normalizeText(input.songRequest) : null;
  const message = input.message ? normalizeMultiline(input.message) : null;

  const guests = normalizeMultiline(input.guestNames)
    .split("\n")
    .map((line) => normalizeText(line))
    .filter(Boolean)
    .slice(0, RSVP.maxPartySize)
    .map((guestName) => ({ name: guestName, isChild: false }));

  const attending = input.attending;
  const partySize = attending === "yes" ? input.partySize : 0;

  // 5. Persist.
  const result = await createRsvp({
    name,
    email,
    phone,
    attending,
    partySize,
    guests,
    dietary,
    songRequest,
    message,
  });

  if (!result.ok) {
    return {
      status: "error",
      message:
        "Something went wrong on our side and your reply was not saved. Please try again, or message Erick.",
    };
  }

  // 6. Notify. Failures here are logged and swallowed: the row is already safe.
  const notifyTo = process.env.CONTACT_TO_EMAIL;
  if (notifyTo) {
    const mail = emailShell(
      attending === "yes" ? `${name} is coming` : `${name} cannot make it`,
      [
        `Name: ${name}`,
        `Attending: ${attending === "yes" ? "Yes" : "No"}`,
        `Party size: ${partySize}`,
        guests.length > 0 ? `Guests: ${guests.map((g) => g.name).join(", ")}` : "Guests: not listed",
        `Email: ${email ?? "not given"}`,
        `Phone: ${phone ?? "not given"}`,
        `Dietary: ${dietary ?? "none"}`,
        `Song request: ${songRequest ?? "none"}`,
        `Message: ${message ?? "none"}`,
      ],
    );
    await sendMail({
      to: notifyTo,
      subject: `RSVP: ${name} (${attending === "yes" ? "attending" : "declined"})`,
      html: mail.html,
      text: mail.text,
      replyTo: email ?? undefined,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/rsvps");

  return {
    status: "success",
    message:
      attending === "yes"
        ? "You are on the list. See you on the seventeenth."
        : "Thank you for letting them know. You will be missed.",
  };
}
