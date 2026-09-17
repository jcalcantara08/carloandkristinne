import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { Monogram } from "@/components/Monogram";
import { Reveal } from "@/components/Reveal";
import { COUPLE, HERO_TONE, SITE, WEDDING_DAY } from "@/lib/constants";
import { getContent } from "@/lib/content";
import { DEFAULT_CONTENT } from "@/lib/content-schema";
import { cn } from "@/lib/utils";

/**
 * The hero.
 *
 * The rule from the well-liked wedding sites and the hero-section guidance
 * reviewed on 17 September 2026: names, date, the photograph and the RSVP
 * button all visible before anyone scrolls, one primary action, and on a
 * phone the photograph full width first with the words on a pale panel
 * beneath.
 *
 * Light tone (the current one): a studio photograph on a white background,
 * shown uncropped on the ice tint with its edges faded into the page, to
 * the right of the words on a laptop and above them on a phone. Dark tone:
 * an outdoor photograph full bleed, paper names low over an ink fade, the
 * practical block beneath. `HERO_TONE` in constants chooses, so the header
 * knows its text colour before anything paints.
 *
 * Earlier versions, so they are not repeated: a full-height veil with the
 * block centred over the beach photograph (names across faces), a rounded
 * photo card beside centred type (read as a brochure), the beach photograph
 * at all (fought the plum and blue branding), and a stacked light hero with
 * the buttons far below the fold.
 */
export async function Hero() {
  const { home } = await getContent();
  // A page save snapshots the whole document, so a document saved before
  // the photographs existed carries an empty heroPhoto the couple never
  // chose; fall back to the default rather than the type-only hero.
  const src = home.heroPhoto || DEFAULT_CONTENT.home.heroPhoto;
  const alt = home.heroPhoto ? home.heroPhotoAlt : DEFAULT_CONTENT.home.heroPhotoAlt;
  const photo = src ? { src, alt } : null;
  const light = photo !== null && HERO_TONE === "light";

  const names = (ampersand: string, size: string) => (
    <>
      <span className="sr-only">
        {COUPLE.bride.fullName} and {COUPLE.groom.fullName} are getting married on {WEDDING_DAY.dateLong}
      </span>
      <span aria-hidden="true" className={cn("block", size)}>
        {COUPLE.bride.firstName}
        <span className={cn("mx-[0.18em] font-display italic", ampersand)}>&amp;</span>
        {/* The only place the names may wrap: after the ampersand, never inside a name. */}
        <wbr />
        {COUPLE.groom.shortName}
      </span>
    </>
  );

  // Everything a guest acts on: the invitation line, the two buttons, the
  // countdown and the hashtag. In the light hero it sits beside the
  // photograph; otherwise beneath it.
  const practical = (left: boolean) => (
    <>
      <Reveal delay={240}>
        {home.intro ? (
          <p className={cn("mt-6 max-w-md text-base leading-relaxed text-brand-ink/75", left ? "mx-auto lg:mx-0" : "mx-auto")}>
            {home.intro}
          </p>
        ) : null}
      </Reveal>

      {/* Always exactly two. Primary plus outline. */}
      <Reveal delay={280}>
        <div className={cn("mt-8 flex flex-col items-center gap-3 sm:flex-row", left ? "justify-center lg:justify-start" : "justify-center")}>
          <Link href="/rsvp" className="btn-primary w-full sm:w-auto">
            {home.primaryLabel || "RSVP"}
          </Link>
          <Link href="/details" className="btn-outline w-full sm:w-auto">
            {home.secondaryLabel || "The details"}
          </Link>
        </div>
      </Reveal>

      <Reveal delay={320}>
        <div className={cn("mt-10 max-w-lg", left ? "mx-auto lg:mx-0" : "mx-auto")}>
          <Countdown />
        </div>
      </Reveal>

      <Reveal delay={360}>
        <p className="mt-7 break-all text-[0.7rem] font-semibold uppercase tracking-eyebrow">
          <span className="aurora-text">{SITE.hashtag}</span>
        </p>
      </Reveal>
    </>
  );

  return (
    <section>
      {light && photo ? (
        <div className="bg-brand-paper-200 pb-14 pt-6 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10">
          <div className="container">
            <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
              {/* The photograph: first on a phone, right of the words from lg.
                  Uncropped, with a four-edge fade so the studio grey has no
                  rectangle against the ice tint. */}
              <Reveal className="lg:order-last lg:col-span-7">
                <div className="relative mx-auto aspect-[3/2] w-full max-w-2xl [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_88%,transparent),linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] lg:max-w-none">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 58vw, (min-width: 640px) 672px, 100vw"
                    className="object-contain"
                  />
                </div>
              </Reveal>

              <div className="text-center lg:col-span-5 lg:text-left">
                <Reveal>
                  <p className="eyebrow">
                    {WEDDING_DAY.dayOfWeek} &middot; {WEDDING_DAY.town}, {WEDDING_DAY.province}
                  </p>
                </Reveal>
                <Reveal delay={80}>
                  <h1 className="mt-4">{names("text-brand-mauve-500", "text-display-xl")}</h1>
                </Reveal>
                <Reveal delay={160}>
                  <p className="mt-5 font-display text-display-md">{WEDDING_DAY.dateLong}</p>
                  <p className="mt-1 text-sm text-brand-ink/65">Ceremony at {WEDDING_DAY.ceremonyTime}</p>
                </Reveal>
                {practical(true)}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {photo && HERO_TONE === "dark" ? (
        <div className="on-ink relative -mt-[4.5rem] h-[80vh] max-h-[56rem] min-h-[34rem] w-full overflow-hidden">
          <Image src={photo.src} alt={photo.alt} fill priority sizes="100vw" className="object-cover object-[50%_30%]" />
          {/* Clear at the top where the faces are, ink at the foot where the names sit. */}
          <div aria-hidden="true" className="absolute inset-0 bg-veil" />
          <div className="absolute inset-x-0 bottom-0 pb-10 sm:pb-14 lg:pb-16">
            <div className="container text-center">
              <Reveal>
                <p className="eyebrow !text-brand-paper/85">
                  {WEDDING_DAY.dayOfWeek} &middot; {WEDDING_DAY.town}, {WEDDING_DAY.province}
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-4">{names("text-brand-mauve-300", "text-display-2xl")}</h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-4 font-display text-display-md">{WEDDING_DAY.dateLong}</p>
              </Reveal>
            </div>
          </div>
        </div>
      ) : null}

      {!photo ? (
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
                <h1 className="mt-6">{names("text-brand-mauve-500", "text-display-2xl")}</h1>
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
      ) : null}

      {!light ? (
        <div className="bg-brand-paper pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal>
                <p className="text-sm text-brand-ink/65">Ceremony at {WEDDING_DAY.ceremonyTime}</p>
              </Reveal>
              {practical(false)}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
