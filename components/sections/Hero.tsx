import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { Monogram } from "@/components/Monogram";
import { Reveal } from "@/components/Reveal";
import { COUPLE, HERO_PHOTO, SITE, WEDDING_DAY } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The hero.
 *
 * Every one of the two dozen well-liked wedding sites reviewed on
 * 17 September 2026 leads with a photograph of the couple. This one is built
 * for that: when `HERO_PHOTO` is set in constants it becomes a full-bleed
 * image with the names over it. Until then it is a calm, centred type hero,
 * which is the honest version rather than a stock image.
 *
 * Centred on purpose. The earlier asymmetric, oversized-type hero was the
 * design's attempt to stand out without a photograph, and the client called
 * it ugly. The reviewed sites are centred, classic and unhurried, and so is
 * this.
 */
export function Hero() {
  const photo = HERO_PHOTO.pending ? null : HERO_PHOTO.value;

  return (
    <section
      className={cn(
        "relative flex items-center overflow-hidden",
        photo ? "on-ink min-h-[88vh]" : "bg-brand-paper pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20",
      )}
    >
      {photo ? (
        <>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* A soft ink veil so the names stay readable over any photograph. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,32,0.35)_0%,rgba(11,18,32,0.55)_60%,rgba(11,18,32,0.75)_100%)]"
          />
        </>
      ) : null}

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <Monogram size="lg" on={photo ? "ink" : "paper"} className="mx-auto" />
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
              <span aria-hidden="true" className="block text-display-2xl">
                {COUPLE.groom.shortName}
                <span
                  className={cn(
                    "mx-[0.18em] font-display italic",
                    photo ? "text-brand-cornflower-300" : "text-brand-cornflower-500",
                  )}
                >
                  &amp;
                </span>
                {COUPLE.bride.firstName}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <div aria-hidden="true" className="rule mx-auto mt-8" />
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-8 font-display text-display-md">{WEDDING_DAY.dateLong}</p>
            <p className={cn("mt-2 text-sm", photo ? "text-brand-paper/75" : "text-brand-ink/65")}>
              Ceremony at {WEDDING_DAY.ceremonyTime}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <p className={cn("mx-auto mt-6 max-w-md text-base leading-relaxed", photo ? "text-brand-paper/85" : "text-brand-ink/75")}>
              In their own words: makulit, masayahin, simple lang. You are warmly invited to be
              there when they promise it out loud.
            </p>
          </Reveal>

          {/* Always exactly two. Primary plus outline. */}
          <Reveal delay={280}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/rsvp" className={cn("w-full sm:w-auto", photo ? "btn-primary-inverse" : "btn-primary")}>
                RSVP
              </Link>
              <Link href="/details" className={cn("w-full sm:w-auto", photo ? "btn-outline-inverse" : "btn-outline")}>
                The details
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
    </section>
  );
}
