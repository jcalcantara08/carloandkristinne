import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { PendingBlock } from "@/components/Pending";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { ENTOURAGE_FOOTNOTE, ENTOURAGE_GROUPS } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "Entourage",
  description:
    "The people walking down the aisle with Carlo and Kristinne: the best man, the maid of honour, the bearers, and the sponsors.",
  path: "/entourage",
});

export default function EntouragePage() {
  return (
    <>
      <PageHeader
        index="04"
        eyebrow="The people"
        title="Who is standing with them"
        intro={
          <p>
            Some of this list is settled and some is still being happily debated in a group chat.
            Both are shown honestly below.
          </p>
        }
      >
        <Link href="/programme" className="btn-primary w-full sm:w-auto">
          The programme
        </Link>
        <Link href="/details" className="btn-outline w-full sm:w-auto">
          What to wear
        </Link>
      </PageHeader>

      {ENTOURAGE_GROUPS.map((group, groupIndex) => (
        <Section key={group.key}>
          <div className="container">
            <SectionHeading
              index={String(groupIndex + 1).padStart(2, "0")}
              eyebrow={group.blurb}
              title={group.title}
            />

            {group.people.length > 0 ? (
              <ul className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.people.map((person, index) => (
                  <Reveal as="li" key={person.name} delay={index * 80}>
                    <Card hover className="h-full text-center">
                      <p className="eyebrow">{person.role}</p>
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
                  note={group.pendingNote ?? "Names go up here as soon as they are set."}
                />
              </Reveal>
            )}
          </div>
        </Section>
      ))}

      <Section>
        <div className="container">
          <Reveal>
            <Card className="mx-auto max-w-2xl border-brand-violet-600/30 text-center">
              <p className="eyebrow">A note on flowers</p>
              <p className="mt-4 text-base leading-relaxed text-brand-ink/80">
                {ENTOURAGE_FOOTNOTE}
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>

      <CtaBanner
        title="Are you on this list?"
        body="If you are, you already know. Either way, Carlo and Kristinne would love to have you in the room."
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
