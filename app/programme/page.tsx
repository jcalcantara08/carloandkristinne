import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { PendingChip } from "@/components/Pending";
import { Card } from "@/components/ui/Card";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import {
  RECEPTION_DOORS,
  RECEPTION_RUNTIME_MINUTES,
  RECEPTION_TIMELINE,
  SCHEDULE,
} from "@/lib/constants";
import { formatClock, formatDuration } from "@/lib/utils";

export const metadata: Metadata = pageMeta({
  title: "Programme",
  description:
    "The run of the day, from the seven in the morning start through the ceremony at four to the send-off at half past eleven.",
  path: "/programme",
});

const PHASES = [
  {
    key: "morning" as const,
    label: "Morning",
    title: "Long before you see any of it",
    blurb:
      "Hair, make-up and photographs, from seven in the morning. The entourage is called for half past eleven.",
  },
  {
    key: "afternoon" as const,
    label: "Afternoon",
    title: "Into the ceremony look",
    blurb: "The change, the retouch, and one hour of enforced rest.",
  },
  {
    key: "ceremony" as const,
    label: "Ceremony",
    title: "The part that counts",
    blurb: "Please come early. This is the half hour they care about most.",
  },
  {
    key: "between" as const,
    label: "In between",
    title: "The gap, and why it is there",
    blurb:
      "The photographs at the church take a while, and the reception is somewhere else. Please do not drive straight over: the doors do not open until a quarter past seven.",
  },
];

/**
 * The reception is rendered separately from the phases above. Its items carry
 * a duration rather than a written clock time, and every time shown is
 * derived from the 7:15 PM doors, so changing one duration moves the rest.
 */

export default function ProgrammePage() {
  // Derived from the list rather than typed out, so the headline figure can
  // never drift away from the row it is summarising.
  const dinner = RECEPTION_TIMELINE.find(({ item }) => item.title.startsWith("Dinner"));
  const dinnerAt = dinner ? formatClock(dinner.clockMinutes) : "See below";

  return (
    <>
      <PageHeader
        index="05"
        eyebrow="The run of show"
        title="One very long Saturday"
        intro={
          <p>
            It starts at seven in the morning and finishes near midnight. Here is the whole of it,
            including the parts you are not expected to be awake for.
          </p>
        }
      >
        <Link href="/rsvp" className="btn-primary w-full sm:w-auto">
          RSVP
        </Link>
        <Link href="/details" className="btn-outline w-full sm:w-auto">
          Venues and dress code
        </Link>
      </PageHeader>

      {PHASES.map((phase, phaseIndex) => {
        const items = SCHEDULE.filter((item) => item.phase === phase.key);
        if (items.length === 0) return null;

        return (
          <Section key={phase.key}>
            <div className="container">
              <SectionHeading
                index={String(phaseIndex + 1).padStart(2, "0")}
                eyebrow={phase.label}
                title={phase.title}
                intro={<p>{phase.blurb}</p>}
              />

              <ol className="mt-12 space-y-px overflow-hidden rounded-2xl border border-brand-line bg-brand-line">
                {items.map((item, index) => (
                  <Reveal
                    as="li"
                    key={item.title}
                    delay={index * 80}
                    className="grid gap-2 bg-brand-paper-100 px-5 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6 sm:px-7"
                  >
                    <div className="shrink-0">
                      {item.time.pending ? (
                        <PendingChip label="Time TBC" />
                      ) : (
                        <span className="font-display text-xl tabular-nums text-brand-ink">
                          {item.time.value}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-medium text-brand-ink">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">
                        {item.detail}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </Section>
        );
      })}

      {/* --- The reception. Clock times derived from the 7:15 PM doors. --- */}
      <Section on="tint">
        <div className="container">
          <SectionHeading
            index="05"
            eyebrow="Reception"
            title="Then, the whole evening"
            intro={
              <p>
                The full running order, in the order your host will actually call it. It opens with
                everybody on their feet and it ends near midnight, with a proper three quarters of
                an hour in the middle for dinner.
              </p>
            }
          />

          <Reveal delay={80}>
            <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-brand-line bg-brand-line sm:grid-cols-3">
              <div className="bg-brand-paper-100 px-5 py-6">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-eyebrow text-brand-ink/60">
                  Doors open
                </dt>
                <dd className="mt-2 font-display text-xl text-brand-ink">{RECEPTION_DOORS}</dd>
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
                <dd className="mt-2 font-display text-xl text-brand-ink">
                  {formatDuration(RECEPTION_RUNTIME_MINUTES)}
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-6 text-sm leading-relaxed text-brand-ink/65">
              Every time below is worked out from the quarter past seven doors, so treat them as
              close rather than exact. A ceremony that runs long, or a room that will not stop
              dancing, moves everything after it. Nobody minds.
            </p>
          </Reveal>

          <ol className="mt-10 space-y-px overflow-hidden rounded-2xl border border-brand-line bg-brand-line">
            {RECEPTION_TIMELINE.map(({ item, clockMinutes }, index) => (
              <Reveal
                as="li"
                key={item.title}
                delay={Math.min(index, 8) * 80}
                className="grid gap-2 bg-brand-paper-100 px-5 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6 sm:px-7"
              >
                <div className="shrink-0">
                  <span className="font-display text-xl tabular-nums text-brand-ink">
                    {formatClock(clockMinutes)}
                  </span>
                  {item.minutes ? (
                    <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-brand-ink/60">
                      {item.minutes} min
                    </span>
                  ) : null}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-medium text-brand-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">{item.detail}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <Section>
        <div className="container">
          <Reveal>
            <Card className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Your host</p>
              <h2 className="mt-4 text-display-md">Erick is running the evening</h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-ink/75">
                He is both the best man and the host, which is two jobs, so a separate on-the-day
                coordinator is being assigned for everything that is not a microphone.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-brand-ink/75">
                The running order below is his, so if you are giving a toast, reading, performing or
                leading the prayer, speak to him well before the day rather than on the night. He
                would much rather move something than surprise you with it.
              </p>
              <div className="mt-7">
                <Link href="/entourage" className="btn-outline">
                  See who else is involved
                </Link>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      <CtaBanner
        title="Tell them you are coming"
        body="The programme comes together far more easily once the couple know who will be there."
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
