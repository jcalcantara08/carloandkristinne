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
      "Messages and photographs go up the moment a guest sends them. You do not need to approve anything.",
      "If something should not be there, press Hide on it, or Delete. Check the Messages and Photographs pages now and then on the day and the week after.",
    ],
  },
  {
    title: "RSVP, and the number the caterer needs",
    body: [
      "Open RSVP to see every reply as a list you can filter (Coming, Not coming), search by name and sort A to Z. The Everyone coming tab numbers every single person, guests included, for the seating plan and the door.",
      "Press Download spreadsheet to get the list as a file. That file is what you send to the caterer and what you build the seating plan from. It opens in Excel, Numbers and Google Sheets.",
      "Deleting a reply is permanent. Only do it for an obvious duplicate or a test entry.",
    ],
  },
  {
    title: "Wishing Wall",
    body: [
      "Every message is on the public wall as soon as it is sent. Hide takes one down without deleting it, and Show again puts it back. Nobody is notified either way.",
    ],
  },
  {
    title: "Gallery",
    body: [
      "Guests upload from the Gallery page on their phone, and each photograph goes straight into the public album, where anyone can view and download it at full size. Hide takes one down.",
      "Delete moves a photograph to the recycle bin. The file itself only goes when the bin lets it go, 14 days later, or when you delete it for good.",
    ],
  },
  {
    title: "Archive, delete, and the recycle bin",
    body: [
      "Every reply, message and photograph sits on one of three shelves. Active is the working list. Archive keeps a record for good but hides it from the list and from the site; use it for a duplicate reply you want to keep, or a message you have dealt with. Delete moves a record to the recycle bin.",
      "The recycle bin holds deleted things for 14 days. Restore puts one back where it came from. Delete for good removes it now, and there is no way back after that. Anything still in the bin after 14 days is removed by itself, files included.",
      "The Active, Archived and Recycle bin chips at the top of each list switch between the shelves. The Recycle bin page in the side panel shows everything in the bin at once, with the day each item goes.",
    ],
  },
  {
    title: "Edit the website",
    body: [
      "Every page has an entry under Edit the website in the side panel: Home, Our story, Details, Programme, Entourage, Gallery, Guestbook and RSVP. Each opens a form with every headline, paragraph, list and photograph on that page. Save and publish puts it live straight away.",
      "Leave a field empty and that line is simply not shown. That is how the venue names, the map links and the sponsor lists stay hidden until you have them: nothing is ever invented in their place.",
      "Lists (the questions and answers, the programme, the entourage groups) have a blank row at the bottom for adding one, and you remove a row by blanking its title. Entourage names are typed one per line as Name | Role | Note.",
      "While you are signed in, every public page shows an Edit this page button at the bottom right that opens the right form. Guests never see it.",
    ],
  },
  {
    title: "Changing what the site says",
    body: [
      "The words and photographs on every page are edited under Edit the website, above. Three things stay in code on purpose and need Erick: the wedding date (it drives the countdown), the guest cap of 100 and the RSVP form's own limits, and the palette.",
      "A change saved in the dashboard is live the moment you save it. A change Erick makes in code goes live about a minute after he publishes it.",
    ],
  },
  {
    title: "Before the wedding, a short routine",
    body: [
      "Once a week: check RSVP, glance at the wishing wall, and look at the headcount.",
      "Two weeks before: download the CSV and send the final number to the caterer.",
      "On the day and after: check Photographs daily, since that is when the uploads arrive.",
    ],
  },
  {
    title: "If something looks wrong",
    body: [
      "A banner at the top of this dashboard tells you if the database is not connected. If you see it, nothing can be saved and Erick needs to know immediately.",
      "If a guest says their reply did not go through, check RSVP first. If it is not there, ask them to try again and tell Erick.",
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
