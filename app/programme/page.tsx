import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { PendingChip } from "@/components/Pending";
import { Card } from "@/components/ui/Card";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { receptionTimeline, type Phase } from "@/lib/content-schema";
import { formatClock, formatDuration } from "@/lib/utils";

export const metadata: Metadata = pageMeta({
  title: "Programme",
  description:
    "The run of the day, from the seven in the morning start through the ceremony at four to the send-off at half past eleven.",
  path: "/programme",
});

const DAY_PHASES: Exclude<Phase, "reception">[] = ["morning", "afternoon", "ceremony", "between"];

/**
 * Every word here comes from the site document (Edit the website,
 * Programme). Day items carry a clock time. Reception items carry a duration
 * instead, and every time shown for them is worked out from the doors time,
 * so changing one duration moves the rest and the two can never disagree.
 */
export default async function ProgrammePage() {
  const { programme } = await getContent();
  const timeline = receptionTimeline(programme.items, programme.doors);
  const runtime = timeline.reduce((total, entry) => total + entry.minutes, 0);

  // Derived from the list rather than typed out, so the headline figure can
  // never drift away from the row it is summarising.
  const dinner = timeline.find(({ item }) => /^dinner/i.test(item.title));
  const dinnerAt = dinner ? formatClock(dinner.clockMinutes) : "See below";

  return (
    <>
      <PageHeader
        eyebrow={programme.eyebrow}
        title={programme.title}
        intro={programme.intro ? <p>{programme.intro}</p> : undefined}
      >
        <Link href="/rsvp" className="btn-primary w-full sm:w-auto">
          RSVP
        </Link>
        <Link href="/details" className="btn-outline w-full sm:w-auto">
          Venues and dress code
        </Link>
      </PageHeader>

      {DAY_PHASES.map((key) => {
        const phase = programme.phases[key];
        const items = programme.items.filter((item) => item.phase === key);
        if (items.length === 0) return null;

        return (
          <Section key={key}>
            <div className="container">
              <SectionHeading
                eyebrow={phase.label}
                title={phase.title}
                intro={phase.blurb ? <p>{phase.blurb}</p> : undefined}
              />

              <ol className="mt-12 space-y-px overflow-hidden rounded-2xl border border-brand-line bg-brand-line">
                {items.map((item, index) => (
                  <Reveal
                    as="li"
                    key={`${item.title}-${index}`}
                    delay={index * 80}
                    className="grid gap-2 bg-brand-paper-100 px-5 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6 sm:px-7"
                  >
                    <div className="shrink-0">
                      {item.time ? (
                        <span className="font-display text-xl tabular-nums text-brand-ink">
                          {item.time}
                        </span>
                      ) : (
                        <PendingChip label="Time TBC" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-medium text-brand-ink">{item.title}</h3>
                      {item.detail ? (
                        <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">{item.detail}</p>
                      ) : null}
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </Section>
        );
      })}

      {/* --- The reception. Clock times derived from the doors time. --- */}
      {timeline.length > 0 ? (
        <Section on="tint">
          <div className="container">
            <SectionHeading
              eyebrow={programme.receptionEyebrow}
              title={programme.receptionTitle}
              intro={programme.receptionIntro ? <p>{programme.receptionIntro}</p> : undefined}
            />

            <Reveal delay={80}>
              <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-brand-line bg-brand-line sm:grid-cols-3">
                <div className="bg-brand-paper-100 px-5 py-6">
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-eyebrow text-brand-ink/60">
                    Doors open
                  </dt>
                  <dd className="mt-2 font-display text-xl text-brand-ink">{programme.doors}</dd>
                </div>
                <div className="bg-brand-paper-100 px-5 py-6">
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-eyebrow text-brand-ink/60">
                    Dinner is called
                  </dt>
                  <dd className="mt-2 font-display text-xl text-brand-ink">{dinnerAt}</dd>
                </div>
                <div className="bg-brand-paper-100 px-5 py-6">
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-eyebrow text-brand-ink/60">
                    Doors to goodnight
                  </dt>
                  <dd className="mt-2 font-display text-xl text-brand-ink">{formatDuration(runtime)}</dd>
                </div>
              </dl>
            </Reveal>

            {programme.receptionNote ? (
              <Reveal delay={120}>
                <p className="mt-6 text-sm leading-relaxed text-brand-ink/65">{programme.receptionNote}</p>
              </Reveal>
            ) : null}

            <ol className="mt-10 space-y-px overflow-hidden rounded-2xl border border-brand-line bg-brand-line">
              {timeline.map(({ item, minutes, clockMinutes }, index) => (
                <Reveal
                  as="li"
                  key={`${item.title}-${index}`}
                  delay={Math.min(index, 8) * 80}
                  className="grid gap-2 bg-brand-paper-100 px-5 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6 sm:px-7"
                >
                  <div className="shrink-0">
                    <span className="font-display text-xl tabular-nums text-brand-ink">
                      {formatClock(clockMinutes)}
                    </span>
                    {minutes ? (
                      <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-brand-ink/60">
                        {minutes} min
                      </span>
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-medium text-brand-ink">{item.title}</h3>
                    {item.detail ? (
                      <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">{item.detail}</p>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Section>
      ) : null}

      {programme.hostTitle ? (
        <Section>
          <div className="container">
            <Reveal>
              <Card className="mx-auto max-w-2xl text-center">
                <p className="eyebrow">{programme.hostEyebrow}</p>
                <h2 className="mt-4 text-display-md">{programme.hostTitle}</h2>
                {programme.hostP1 ? (
                  <p className="mt-4 text-sm leading-relaxed text-brand-ink/75">{programme.hostP1}</p>
                ) : null}
                {programme.hostP2 ? (
                  <p className="mt-3 text-sm leading-relaxed text-brand-ink/75">{programme.hostP2}</p>
                ) : null}
                <div className="mt-7">
                  <Link href="/entourage" className="btn-outline">
                    See who else is involved
                  </Link>
                </div>
              </Card>
            </Reveal>
          </div>
        </Section>
      ) : null}

      <CtaBanner
        title={programme.ctaTitle}
        body={programme.ctaBody}
        secondary={{ href: "/entourage", label: "The entourage" }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Programme", path: "/programme" },
            ]),
          ),
        }}
      />
    </>
  );
}
