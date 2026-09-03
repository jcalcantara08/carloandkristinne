import { requireAuth } from "@/lib/admin-guard";
import { Card } from "@/components/ui/Card";
import { listAudit } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";

/**
 * The owner guide, rendered where the owner works.
 *
 * A manual in a file at the root of a repository is a manual nobody reads.
 * This is the same content as Part 1 of USER_MANUAL.md, one click from the
 * dashboard.
 */

const SECTIONS = [
  {
    title: "What this site is",
    body: [
      "This is the wedding website for Carlo and Kristinne, 17 October 2026 in Rosario, Cavite. Guests use it to read the details, reply to the invitation, leave a message, and after the day, to upload and download photographs.",
      "You are looking at the private side of it. Nobody can reach these pages without the password.",
    ],
  },
  {
    title: "The one thing to know",
    body: [
      "Nothing a guest uploads or writes appears in public until you approve it. Messages and photographs both arrive as pending, and both sit under Waiting for you until you press Publish.",
      "That is deliberate. An open upload box on a public address needs a human in the loop.",
    ],
  },
  {
    title: "Replies, and the number the caterer needs",
    body: [
      "Open Replies to see every RSVP. The Overview page shows the confirmed headcount against the 100 seats.",
      "Press Download CSV to get a spreadsheet. That file is what you send to the caterer and what you build the seating plan from. It opens in Excel, Numbers and Google Sheets.",
      "Deleting a reply is permanent. Only do it for an obvious duplicate or a test entry.",
    ],
  },
  {
    title: "Messages",
    body: [
      "Publish puts a message on the public wall. Hide takes it down again without deleting it. Back to pending is there if you want to think about it.",
      "Messages you never publish simply never appear. Nobody is notified either way.",
    ],
  },
  {
    title: "Photographs",
    body: [
      "Guests upload from the Gallery page on their phone. Publish adds a photograph to the public album, where anyone can view and download it at full size.",
      "Delete removes both the record and the actual file from storage. It cannot be undone.",
    ],
  },
  {
    title: "Changing what the site says",
    body: [
      "Almost every fact on the public pages, the venue names, the times, the entourage, the dress code, the questions and answers, lives in one file: lib/constants.ts.",
      "Anything not yet decided is marked as pending in that file, and the site shows a small To be confirmed chip in its place rather than a blank or an invented answer. Fill in the real value and the chip disappears by itself.",
      "Ask Erick to make these edits, or make them yourself and the site rebuilds automatically within about a minute.",
    ],
  },
  {
    title: "Before the wedding, a short routine",
    body: [
      "Once a week: check Replies, publish any waiting messages, and glance at the headcount.",
      "Two weeks before: download the CSV and send the final number to the caterer.",
      "On the day and after: check Photographs daily, since that is when the uploads arrive.",
    ],
  },
  {
    title: "If something looks wrong",
    body: [
      "A banner at the top of this dashboard tells you if the database is not connected. If you see it, nothing can be saved and Erick needs to know immediately.",
      "If a guest says their reply did not go through, check Replies first. If it is not there, ask them to try again and tell Erick.",
      "Sign out when you are finished on a shared or borrowed device. Sessions last eight hours.",
    ],
  },
];

export default async function AdminManualPage() {
  await requireAuth();
  const audit = await listAudit(20);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-display-md">How to run this site</h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-brand-ink/70">
          Written for Carlo and Kristinne, in plain language. Nothing here needs any technical
          knowledge.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {SECTIONS.map((section) => (
          <Card key={section.title} className="h-full">
            <h3 className="text-lg font-medium text-brand-ink">{section.title}</h3>
            <div className="mt-3 space-y-3">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-brand-ink/75">
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-lg font-medium text-brand-ink">Recent activity</h3>
        <p className="mt-2 text-sm text-brand-ink/65">
          Every publish, hide, delete and export is recorded here.
        </p>

        {audit.length === 0 ? (
          <p className="mt-5 text-sm text-brand-ink/60">Nothing recorded yet.</p>
        ) : (
          <ul className="mt-5 divide-y divide-brand-line text-sm">
            {audit.map((row) => (
              <li key={row.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                <span className="text-brand-ink/80">
                  <span className="font-medium">{row.action}</span>
                  <span className="ml-2 break-all text-brand-ink/60">{row.detail}</span>
                </span>
                <span className="text-xs text-brand-ink/60">{formatDateTime(row.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
