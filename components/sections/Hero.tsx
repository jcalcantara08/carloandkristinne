import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { Monogram } from "@/components/Monogram";
import { Reveal } from "@/components/Reveal";
import { COUPLE, SITE, WEDDING_DAY } from "@/lib/constants";
import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The hero.
 *
 * Every one of the two dozen well-liked wedding sites reviewed on
 * 17 September 2026 leads with a photograph of the couple. When the site
 * document carries one it sits beside the type: names on the left, the
 * photograph framed on the right, stacked on a phone with the photograph
 * first. Without one it is a calm, centred type hero.
 *
 * Side by side rather than full-bleed with the names over the top: the
 * couple stand in the centre of every photograph they have, so a veil and
 * centred type put "Carlo & Kristinne" straight across their faces. Tried on
 * 17 September, read badly, replaced the same day.
 *
 * Centred on purpose. The earlier asymmetric, oversized-type hero was the
 * design's attempt to stand out without a photograph, and the client called
 * it ugly.
 */
export async function Hero() {
  const { home } = await getContent();
  // Set from the dashboard (Edit the website, Home). Empty means type only.
  const photo = home.heroPhoto ? { src: home.heroPhoto, alt: home.heroPhotoAlt } : null;

  return (
    <section className="bg-brand-paper pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
      <div className="container">
        <div className={cn(photo ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-16" : undefined)}>
          {photo ? (
            <Reveal className="lg:order-last">
              <div className="relative mx-auto aspect-[3/2] w-full max-w-2xl overflow-hidden rounded-3xl border border-brand-line bg-brand-paper-200 shadow-soft lg:aspect-[4/5] lg:max-w-none">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}

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
              <h1 className="mt-6">
                <span className="sr-only">
                  {COUPLE.groom.fullName} and {COUPLE.bride.fullName} are getting married on{" "}
                  {WEDDING_DAY.dateLong}
                </span>
                <span aria-hidden="true" className={cn("block", photo ? "text-display-xl" : "text-display-2xl")}>
                  {COUPLE.groom.shortName}
                  <span className="mx-[0.18em] font-display italic text-brand-cornflower-500">&amp;</span>
                  {COUPLE.bride.firstName}
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <div aria-hidden="true" className="rule mx-auto mt-8" />
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-8 font-display text-display-md">{WEDDING_DAY.dateLong}</p>
              <p className="mt-2 text-sm text-brand-ink/65">Ceremony at {WEDDING_DAY.ceremonyTime}</p>
            </Reveal>

            <Reveal delay={240}>
              {home.intro ? (
                <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-brand-ink/75">{home.intro}</p>
              ) : null}
            </Reveal>

            {/* Always exactly two. Primary plus outline. */}
            <Reveal delay={280}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/rsvp" className="btn-primary w-full sm:w-auto">
                  {home.primaryLabel || "RSVP"}
                </Link>
                <Link href="/details" className="btn-outline w-full sm:w-auto">
                  {home.secondaryLabel || "The details"}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mx-auto mt-12 max-w-lg">
                <Countdown />
              </div>
            </Reveal>

            <Reveal delay={360}>
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
