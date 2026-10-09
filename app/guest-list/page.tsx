import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { listGuestList } from "@/lib/store";

/**
 * The guest list (Erick, 6 October 2026): names only, of everyone who said
 * yes, so guests can check they are on it. `listGuestList()` selects only the
 * name columns. Archive an RSVP in the dashboard to take a name off. Real
 * names, so the page stays out of search results and the sitemap.
 */
export const metadata: Metadata = pageMeta({
  title: "Guest List",
  description: "Everyone who has said yes to Carlo and Kristinne's wedding.",
  path: "/guest-list",
  noIndex: true,
});

export default async function GuestListPage() {
  const [{ rsvp }, guestList] = await Promise.all([getContent(), listGuestList()]);
  const peopleOnList = guestList.reduce((sum, entry) => sum + entry.seats, 0);
  // Seat numbers per reply (Erick, 10 October 2026): "1-3", then "4-10", so
  // the last number is the running total.
  const slots: string[] = [];
  let seatCursor = 0;
  for (const entry of guestList) {
    slots.push(entry.seats === 1 ? `${seatCursor + 1}` : `${seatCursor + 1}-${seatCursor + entry.seats}`);
    seatCursor += entry.seats;
  }

  return (
    <>
      <PageHeader
        eyebrow={rsvp.listEyebrow}
        title={rsvp.listTitle}
        intro={rsvp.listIntro ? <p>{rsvp.listIntro}</p> : undefined}
      />

      <Section>
        <div className="container">
          {guestList.length === 0 ? (
            rsvp.listEmpty ? (
              <p className="mx-auto mt-10 max-w-xl rounded-2xl border border-dashed border-brand-line-strong bg-brand-paper-200 p-8 text-center text-sm text-brand-ink/70">
                {rsvp.listEmpty}
              </p>
            ) : null
          ) : (
            <Reveal>
              <Card className="mx-auto mt-10 max-w-6xl p-0">
                <p className="border-b border-brand-line px-6 py-4 text-center text-xs uppercase tracking-wider text-brand-ink/60">
                  {guestList.length} {guestList.length === 1 ? "RSVP" : "RSVPs"}, {peopleOnList} {peopleOnList === 1 ? "seat" : "seats"} so far
                </p>
                <ol className="grid gap-x-8 px-6 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {guestList.map((entry, index) => {
                    const unnamed = entry.seats - 1 - entry.guests.length;
                    const others = [...entry.guests, ...(unnamed > 0 ? [`${unnamed} more`] : [])];
                    return (
                      <li key={`${entry.name}-${index}`} className="flex gap-3 border-b border-brand-line py-3 text-sm">
                        <span className="w-14 shrink-0 text-right tabular-nums text-brand-ink/60">{slots[index]}</span>
                        <span className="min-w-0 flex-1">
                          <span className="font-medium text-brand-ink">{entry.name}</span>
                          {others.length > 0 ? (
                            <span className="mt-0.5 block text-xs text-brand-ink/60">with {others.join(", ")}</span>
                          ) : null}
                        </span>
                        <span className="shrink-0 self-start rounded-full bg-brand-plum-100 px-2 py-0.5 text-xs tabular-nums text-brand-plum-600">
                          {entry.seats} {entry.seats === 1 ? "seat" : "seats"}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </Card>
            </Reveal>
          )}

          <div className="mt-10 text-center">
            <p className="text-sm text-brand-ink/70">Not on the list yet?</p>
            <Link href="/rsvp" className="btn-primary mt-4">
              RSVP now
            </Link>
          </div>
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Guest List", path: "/guest-list" },
            ]),
          ),
        }}
      />
    </>
  );
}
