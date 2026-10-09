import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/admin-guard";
import { Card } from "@/components/ui/Card";
import { Hint, Input, Label, Select, Textarea } from "@/components/ui/Field";
import { getRsvp, seatsFor } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { saveRsvpEdit } from "@/app/admin/(dashboard)/rsvps/actions";

/** The couple's edit form for one reply (10 October 2026). */
export default async function EditRsvpPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAuth();

  const { id } = await params;
  const { error } = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const rsvp = await getRsvp(id);
  if (!rsvp) notFound();

  const named = 1 + rsvp.guests.length;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/rsvps" className="text-sm text-brand-plum-500 hover:underline">
          Back to RSVP
        </Link>
        <h2 className="mt-3 text-display-md">Edit RSVP</h2>
        <p className="mt-2 text-sm text-brand-ink/70">
          Sent {formatDateTime(rsvp.createdAt)}. Changes show on the Guest List as soon as you save.
        </p>
      </div>

      {error ? (
        <Card className="border-brand-mauve-600/40 text-sm text-brand-mauve-600">
          {error === "save"
            ? "That did not save. Please try again."
            : `Please check: ${error}. Names need 2 letters or more, and the email and number must look real.`}
        </Card>
      ) : null}

      {rsvp.attending === "yes" && named !== rsvp.partySize ? (
        <Card className="text-sm text-brand-ink/75">
          The guest picked <strong>{rsvp.partySize}</strong> but named <strong>{named}</strong>{" "}
          {named === 1 ? "person" : "people"}, so this RSVP counts as <strong>{seatsFor(rsvp)}</strong> seats.
          Set the number and the names to agree and the warning goes away.
        </Card>
      ) : null}

      <Card className="max-w-2xl p-6 sm:p-8">
        <form action={saveRsvpEdit} className="space-y-6">
          <input type="hidden" name="id" value={rsvp.id} />

          <div>
            <Label htmlFor="edit-name" required>Name</Label>
            <Input id="edit-name" name="name" defaultValue={rsvp.name} required minLength={2} maxLength={120} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-attending" required>RSVP</Label>
              <Select id="edit-attending" name="attending" defaultValue={rsvp.attending}>
                <option value="yes">Coming</option>
                <option value="no">Not coming</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-party" required>Seats (including them)</Label>
              <Input
                id="edit-party"
                name="partySize"
                type="number"
                min={1}
                max={20}
                defaultValue={Math.max(1, rsvp.partySize)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-guests">Who is coming with them</Label>
            <Textarea
              id="edit-guests"
              name="guestNames"
              defaultValue={rsvp.guests.map((guest) => guest.name).join("\n")}
              rows={4}
            />
            <Hint>One name per line. Leave a name out and the list shows &quot;1 more&quot; instead.</Hint>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-phone">Mobile number</Label>
              <Input id="edit-phone" name="phone" defaultValue={rsvp.phone ?? ""} maxLength={24} />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" name="email" type="email" defaultValue={rsvp.email ?? ""} maxLength={160} />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-dietary">Food notes</Label>
            <Textarea id="edit-dietary" name="dietary" defaultValue={rsvp.dietary ?? ""} rows={2} maxLength={400} />
          </div>

          <div>
            <Label htmlFor="edit-song">Song request</Label>
            <Input id="edit-song" name="songRequest" defaultValue={rsvp.songRequest ?? ""} maxLength={200} />
          </div>

          <div>
            <Label htmlFor="edit-message">Note</Label>
            <Textarea id="edit-message" name="message" defaultValue={rsvp.message ?? ""} rows={3} maxLength={1200} />
          </div>

          <div className="flex flex-wrap gap-3 border-t border-brand-line pt-6">
            <button type="submit" className="btn-primary px-6">Save changes</button>
            <Link href="/admin/rsvps" className="btn-outline px-6">Cancel</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
