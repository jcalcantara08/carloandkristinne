import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { PendingBlock } from "@/components/Pending";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { linesToPeople } from "@/lib/content-schema";
import { SHOW_PENDING } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMeta({
  title: "Entourage",
  description:
    "The people walking down the aisle with Carlo and Kristinne: the best man, the maid of honour, the bearers, and the sponsors.",
  path: "/entourage",
});

/**
 * Every group and every name comes from the site document (Edit the website,
 * Entourage), typed one person per line as Name | Role | Note. A group with
 * no names yet is not shown to guests.
 */
export default async function EntouragePage() {
  const { entourage } = await getContent();
  const groups = entourage.groups.map((group) => ({ ...group, list: linesToPeople(group.people) }));

  return (
    <>
      <PageHeader
        eyebrow={entourage.eyebrow}
        title={entourage.title}
        intro={entourage.intro ? <p>{entourage.intro}</p> : undefined}
        photos={entourage.headerPhotos}
      >
        <Link href="/programme" className="btn-primary w-full sm:w-auto">
          The programme
        </Link>
        <Link href="/details" className="btn-outline w-full sm:w-auto">
          What to wear
        </Link>
      </PageHeader>

      {groups
        .filter((group) => group.list.length > 0 || SHOW_PENDING)
        .map((group) => (
          <Section key={group.title}>
            <div className="container">
              <SectionHeading eyebrow={group.blurb} title={group.title} />

              {/* Sponsors are read in pairs, so their grid stays two across. */}
              {group.list.length > 0 ? (
                <ul
                  className={cn(
                    "mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2",
                    /sponsors/i.test(group.title) ? "max-w-3xl" : "lg:grid-cols-3",
                  )}
                >
                  {group.list.map((person, index) => (
                    <Reveal as="li" key={`${person.name}-${index}`} delay={index * 80}>
                      <Card hover className="h-full text-center">
                        {person.role ? <p className="eyebrow">{person.role}</p> : null}
                        <p className="mt-4 font-display text-xl text-brand-ink">{person.name}</p>
                        {person.note ? (
                          <p className="mt-2 text-xs text-brand-ink/60">{person.note}</p>
                        ) : null}
                      </Card>
                    </Reveal>
                  ))}
                </ul>
              ) : (
                <Reveal delay={80}>
                  <PendingBlock
                    className="mx-auto mt-12 max-w-2xl"
                    title={`${group.title} are still being confirmed`}
                    note={group.pendingNote || "Names go up here as soon as they are set."}
                  />
                </Reveal>
              )}
            </div>
          </Section>
        ))}

      {entourage.footnote ? (
        <Section>
          <div className="container">
            <Reveal>
              <Card className="mx-auto max-w-2xl border-brand-plum-600/30 text-center">
                <p className="eyebrow">{entourage.footnoteEyebrow}</p>
                <p className="mt-4 text-base leading-relaxed text-brand-ink/80">{entourage.footnote}</p>
              </Card>
            </Reveal>
          </div>
        </Section>
      ) : null}

      <CtaBanner
        title={entourage.ctaTitle}
        body={entourage.ctaBody}
        secondary={{ href: "/programme", label: "See the programme" }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Entourage", path: "/entourage" },
            ]),
          ),
        }}
      />
    </>
  );
}
