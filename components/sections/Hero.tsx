import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { Monogram } from "@/components/Monogram";
import { Reveal } from "@/components/Reveal";
import { COUPLE, SITE, WEDDING_DAY } from "@/lib/constants";
import { getContent } from "@/lib/content";
import { DEFAULT_CONTENT } from "@/lib/content-schema";
import { cn } from "@/lib/utils";

/**
 * The hero.
 *
 * What the well-liked wedding sites do (reviewed 17 September 2026, and
 * again the same night): one photograph across the full width, the names
 * low on the image over a soft dark fade, and the practical block (the
 * invitation line, two buttons, the countdown) directly beneath on paper.
 * The couple's faces sit in the clear upper part of the photograph; the
 * fade only ever covers shoulders and sand.
 *
 * Two versions were tried first and rejected the same day: a full-height
 * veil with the whole block centred over the photograph (the names landed
 * across their faces, since the couple stand centred in every photograph),
 * and a side-by-side card (read as a brochure). Without a photograph the
 * hero is the calm centred type version.
 */
export async function Hero() {
  const { home } = await getContent();
  // A page save snapshots the whole document, so a document saved before
  // the photographs existed carries an empty heroPhoto the couple never
  // chose; fall back to the default rather than the type-only hero.
  const src = home.heroPhoto || DEFAULT_CONTENT.home.heroPhoto;
  const alt = home.heroPhoto ? home.heroPhotoAlt : DEFAULT_CONTENT.home.heroPhotoAlt;
  const photo = src ? { src, alt } : null;

  const names = (ampersand: string) => (
    <>
      <span className="sr-only">
        {COUPLE.bride.fullName} and {COUPLE.groom.fullName} are getting married on {WEDDING_DAY.dateLong}
      </span>
      <span aria-hidden="true" className="block text-display-2xl">
        {COUPLE.bride.firstName}
        <span className={cn("mx-[0.18em] font-display italic", ampersand)}>&amp;</span>
        {COUPLE.groom.shortName}
      </span>
    </>
  );

  return (
    <section>
      {/* Pulled up under the transparent header so the photograph starts at the very top. */}
      {photo ? (
        <div className="on-ink relative -mt-[4.5rem] h-[80vh] max-h-[56rem] min-h-[34rem] w-full overflow-hidden">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_30%]"
          />
          {/* Clear at the top where the faces are, ink at the foot where the names sit. */}
          <div aria-hidden="true" className="absolute inset-0 bg-veil" />

          <div className="absolute inset-x-0 bottom-0 pb-10 sm:pb-14 lg:pb-16">
            <div className="container text-center">
              <Reveal>
                <p className="eyebrow">
                  {WEDDING_DAY.dayOfWeek} &middot; {WEDDING_DAY.town}, {WEDDING_DAY.province}
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-4">{names("text-brand-mauve-300")}</h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-4 font-display text-display-md">{WEDDING_DAY.dateLong}</p>
              </Reveal>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-brand-paper pt-12 sm:pt-16 lg:pt-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal>
                <Monogram size="lg" on="paper" className="mx-auto" />
              </Reveal>
              <Reveal delay={80}>
                <p className="eyebrow mt-8">
                  {WEDDING_DAY.dayOfWeek} &middot; {WEDDING_DAY.town}, {WEDDING_DAY.province}
                </p>
              </Reveal>
              <Reveal delay={120}>
                <h1 className="mt-6">{names("text-brand-mauve-500")}</h1>
              </Reveal>
              <Reveal delay={160}>
                <div aria-hidden="true" className="rule mx-auto mt-8" />
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-8 font-display text-display-md">{WEDDING_DAY.dateLong}</p>
              </Reveal>
            </div>
          </div>
        </div>
      )}

      {/* The practical block, on paper, under the photograph. */}
      <div className="bg-brand-paper pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="text-sm text-brand-ink/65">Ceremony at {WEDDING_DAY.ceremonyTime}</p>
              {home.intro ? (
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-brand-ink/75">{home.intro}</p>
              ) : null}
            </Reveal>

            {/* Always exactly two. Primary plus outline. */}
            <Reveal delay={80}>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/rsvp" className="btn-primary w-full sm:w-auto">
                  {home.primaryLabel || "RSVP"}
                </Link>
                <Link href="/details" className="btn-outline w-full sm:w-auto">
                  {home.secondaryLabel || "The details"}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="mx-auto mt-12 max-w-lg">
                <Countdown />
              </div>
            </Reveal>

            <Reveal delay={240}>
              <p className="mt-8 break-all text-[0.7rem] font-semibold uppercase tracking-eyebrow">
                <span className="aurora-text">{SITE.hashtag}</span>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
