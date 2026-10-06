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
  const peopleOnList = guestList.reduce((sum, entry) => sum + 1 + entry.guests.length, 0);

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
                  {peopleOnList} {peopleOnList === 1 ? "person" : "people"} so far
                </p>
                <ol className="grid gap-x-8 px-6 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {guestList.map((entry, index) => (
                    <li key={`${entry.name}-${index}`} className="border-b border-brand-line py-3 text-sm">
                      <span className="font-medium text-brand-ink">{entry.name}</span>
                      {entry.guests.length > 0 ? (
                        <span className="mt-0.5 block text-xs text-brand-ink/60">with {entry.guests.join(", ")}</span>
                      ) : null}
                    </li>
                  ))}
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
