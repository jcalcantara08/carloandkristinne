import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Card } from "@/components/ui/Card";
import { pageMeta } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMeta({
  title: "Our Story",
  description:
    "How Carlo and Kristinne got here, what the hashtag means, and what they want the day to feel like.",
  path: "/our-story",
});

/**
 * Every word here comes from the site document (Edit the website, Our story).
 * The couple's own story stays hidden until they write it: an empty field is
 * simply not rendered, never padded out with invented romance.
 */
export default async function OurStoryPage() {
  const { ourStory } = await getContent();
  const storyParagraphs = ourStory.storyBody.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <PageHeader
        eyebrow={ourStory.eyebrow}
        title={ourStory.title}
        intro={ourStory.intro ? <p>{ourStory.intro}</p> : undefined}
      />

      <Section>
        <div className="container grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              align="left"
              eyebrow={ourStory.hashtagEyebrow}
              /* break-all, not the base break-word: only the former reduces
                 min-content width, and this heading sits in a grid item whose
                 min-width is auto. Without it the hashtag sets a 492px floor
                 and scrolls the whole page sideways at 375px. */
              title={<span className="break-all">{SITE.hashtag}</span>}
              intro={
                <>
                  {ourStory.hashtagP1 ? <p>{ourStory.hashtagP1}</p> : null}
                  {ourStory.hashtagP2 ? <p className="mt-4">{ourStory.hashtagP2}</p> : null}
                </>
              }
            />
          </div>

          {ourStory.quote ? (
            <Reveal delay={120} className="lg:col-span-5">
              <Card className="border-brand-plum-600/30">
                <p className="eyebrow">{ourStory.quoteEyebrow}</p>
                <blockquote className="mt-5 font-display text-display-md leading-tight">
                  &ldquo;{ourStory.quote}&rdquo;
                </blockquote>
                {ourStory.quoteNote ? (
                  <p className="mt-5 text-sm leading-relaxed text-brand-ink/70">{ourStory.quoteNote}</p>
                ) : null}
              </Card>
            </Reveal>
          ) : null}
        </div>
      </Section>

      {/* --- One of each of them, side by side. --- */}
      {ourStory.pair.length > 0 ? (
        <Section>
          <div className="container">
            <SectionHeading eyebrow={ourStory.pairEyebrow} title={ourStory.pairTitle} />
            <ul className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-5">
              {ourStory.pair.slice(0, 2).map((photo, index) => (
                <Reveal as="li" key={photo.src} delay={index * 80}>
                  <figure>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-brand-line bg-brand-paper-200">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    {photo.caption ? (
                      <figcaption className="mt-3 text-center font-display text-xl text-brand-ink">{photo.caption}</figcaption>
                    ) : null}
                  </figure>
                </Reveal>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {/* --- The photographs. Landscape frames 3:2, portrait 4:5, two per row. --- */}
      {ourStory.photos.length > 0 ? (
        <Section on="tint">
          <div className="container">
            <SectionHeading
              eyebrow={ourStory.photosEyebrow}
              title={ourStory.photosTitle}
              intro={ourStory.photosIntro ? <p>{ourStory.photosIntro}</p> : undefined}
            />
            <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 sm:gap-5">
              {ourStory.photos.map((photo, index) => (
                <Reveal as="li" key={photo.src} delay={index * 80}>
                  <figure>
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-2xl border border-brand-line bg-brand-paper-200",
                        photo.shape === "portrait" ? "aspect-[4/5]" : "aspect-[3/2]",
                      )}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    {photo.caption ? (
                      <figcaption className="mt-3 text-center text-sm text-brand-ink/60">{photo.caption}</figcaption>
                    ) : null}
                  </figure>
                </Reveal>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {ourStory.values.length > 0 ? (
        <Section>
          <div className="container">
            <SectionHeading
              eyebrow={ourStory.valuesEyebrow}
              title={ourStory.valuesTitle}
              intro={ourStory.valuesIntro ? <p>{ourStory.valuesIntro}</p> : undefined}
            />

            <ul className="mt-12 grid gap-5 sm:grid-cols-3">
              {ourStory.values.map((value, index) => (
                <Reveal as="li" key={value.title} delay={index * 80}>
                  <Card hover className="h-full">
                    <span
                      className="font-display text-3xl text-brand-ink/60 tabular-nums"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-display-md">{value.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-ink/75">{value.body}</p>
                  </Card>
                </Reveal>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {storyParagraphs.length > 0 ? (
        <Section>
          <div className="container">
            <SectionHeading eyebrow={ourStory.storyEyebrow} title={ourStory.storyTitle} />
            <Reveal delay={80}>
              <div className="prose-body mx-auto mt-12 max-w-2xl space-y-5">
                {storyParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </Section>
      ) : null}

      <Section>
        <div className="container text-center">
          <Reveal>
            <Link href="/entourage" className="btn-outline">
              Meet the people standing with them
            </Link>
          </Reveal>
        </div>
      </Section>

      <CtaBanner title={ourStory.ctaTitle} body={ourStory.ctaBody} />
    </>
  );
}
