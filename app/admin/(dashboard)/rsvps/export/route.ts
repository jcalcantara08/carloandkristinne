import { requireAuth } from "@/lib/admin-guard";
import { listRsvps, writeAudit } from "@/lib/store";
import { csvResponse, toCsv } from "@/lib/csv";

/**
 * The CSV the caterer actually wants.
 * A route handler is a public endpoint. requireAuth() first, always.
 */
export async function GET(): Promise<Response> {
  try {
    await requireAuth();
  } catch {
    return new Response("Not authorised.", { status: 401 });
  }

  const rsvps = await listRsvps();

  const rows = rsvps.map((rsvp) => ({
    Submitted: rsvp.createdAt,
    Name: rsvp.name,
    Attending: rsvp.attending === "yes" ? "Yes" : "No",
    "Party size": rsvp.partySize,
    Guests: rsvp.guests.map((guest) => guest.name).join("; "),
    Email: rsvp.email ?? "",
    Phone: rsvp.phone ?? "",
    Dietary: rsvp.dietary ?? "",
    "Song request": rsvp.songRequest ?? "",
    Message: rsvp.message ?? "",
  }));

  const csv = toCsv(rows, [
    "Submitted",
    "Name",
    "Attending",
    "Party size",
    "Guests",
    "Email",
    "Phone",
    "Dietary",
    "Song request",
    "Message",
  ]);

  await writeAudit("rsvp.export", `${rows.length} rows exported`);

  return csvResponse(csv, `carlo-kristinne-rsvps-${new Date().toISOString().slice(0, 10)}.csv`);
}
