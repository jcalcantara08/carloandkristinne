import Link from "next/link";
import { Aurora } from "@/components/Aurora";
import { Countdown } from "@/components/Countdown";
import { Reveal } from "@/components/Reveal";
import { COUPLE, SITE, WEDDING_DAY } from "@/lib/constants";

/**
 * The hero.
 *
 * Deliberately NOT the house centred stack. A centred eyebrow over a centred
 * h1 over two centred buttons is the shape every wedding site has, and the
 * couple asked for something that did not look like the rest of them.
 *
 * Instead: an editorial spread. The names are set enormous and left-aligned
 * in three staggered lines, the date sits vertically down the left margin as
 * a folio, and the countdown and hashtag hang in a narrow right-hand column
 * divided by a hairline. The ribbon passes behind all of it.
 *
 * Type-only, because there is not a single wedding photograph yet and a stock
 * image would be a lie. At this scale the Bodoni is the image.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-10 sm:pb-20 lg:pb-28 lg:pt-16">
      <Aurora />

      {/* The folio: the date, set vertically down the left margin.
          Large screens only, where there is margin to put it in. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 xl:block"
      >
        <span className="block origin-center -rotate-90 whitespace-nowrap text-xs font-semibold uppercase tracking-eyebrow text-brand-ink/60">
          {WEDDING_DAY.dayOfWeek} &middot; {WEDDING_DAY.dateShort} &middot; {WEDDING_DAY.town}
        </span>
      </div>

      <div className="container relative">
        <div className="grid items-end gap-y-10 lg:grid-cols-12 lg:gap-x-10">
          {/* --- The names --- */}
          <div className="lg:col-span-8">
            <Reveal>
              <p className="eyebrow">
                {WEDDING_DAY.dayOfWeek} &middot; {WEDDING_DAY.town}, {WEDDING_DAY.province}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-7">
                <span className="sr-only">
                  {COUPLE.groom.fullName} and {COUPLE.bride.fullName} are getting married on{" "}
                  {WEDDING_DAY.dateLong}
                </span>

                <span aria-hidden="true" className="block text-display-2xl">
                  <span className="block">{COUPLE.groom.shortName}</span>
                  {/* The ampersand is the one piece of colour in the hero,
                      indented so the block reads as three staggered lines
                      rather than a centred stack. */}
                  <span className="my-1 block pl-[0.22em] font-display italic">
                    <span className="aurora-text">&amp;</span>
                  </span>
                  <span className="block pl-[0.08em]">{COUPLE.bride.firstName}</span>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <div aria-hidden="true" className="rule mt-10" />
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-7 max-w-md text-base leading-relaxed text-brand-ink/75">
                In their own words: makulit, masayahin, simple lang. You are warmly invited to be
                there when they promise it out loud.
              </p>
            </Reveal>

            {/* Always exactly two. Primary plus outline. */}
            <Reveal delay={280}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/rsvp" className="btn-primary w-full sm:w-auto">
                  RSVP
                </Link>
                <Link href="/details" className="btn-outline w-full sm:w-auto">
                  The details
                </Link>
              </div>
            </Reveal>
          </div>

          {/* --- The right column: date, countdown, hashtag --- */}
          <div className="lg:col-span-4">
            <Reveal delay={240}>
              <div className="border-t border-brand-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <p className="font-display text-display-md leading-none">
                  {WEDDING_DAY.day}
                  <span className="mx-2 text-brand-ink/60">/</span>
                  {WEDDING_DAY.month}
                  <span className="mx-2 text-brand-ink/60">/</span>
                  {WEDDING_DAY.year}
                </p>
                <p className="mt-2 text-sm text-brand-ink/60">
                  Ceremony at {WEDDING_DAY.ceremonyTime}
                </p>

                <div className="mt-8">
                  <Countdown />
                </div>

                <p className="mt-8 break-all text-[0.7rem] font-semibold uppercase tracking-eyebrow">
                  <span className="aurora-text">{SITE.hashtag}</span>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
