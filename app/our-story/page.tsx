import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { PhotoFrame } from "@/components/PhotoFrame";
import { PendingBlock } from "@/components/Pending";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Card } from "@/components/ui/Card";
import { pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "Our Story",
  description:
    "How Carlo and Kristinne got here, what the hashtag means, and what they want the day to feel like.",
  path: "/our-story",
});

/**
 * The couple have not written their proposal or how-we-met story yet, so this
 * page leads with what IS on the record (the hashtag, the mission statement,
 * the priorities) and marks the rest as a labelled placeholder rather than
 * padding it out with invented romance.
 */
const VALUES = [
  {
    title: "The church moment",
    body: "The first of the three things they said were worth spending on. Everything else on the day is arranged around this half hour.",
  },
  {
    title: "The food",
    body: "One hundred people, fed properly, in a room with air conditioning. Not a small thing to pull off in October.",
  },
  {
    title: "The photographs",
    body: "A photographer and videographer on them from ten in the morning until nearly midnight, and an entourage who agreed to a half past eleven call with a speed they may come to question, and will absolutely be glad about.",
  },
];

export default function OurStoryPage() {
  return (
    <>
      <PageHeader
        index="01"
        eyebrow="Kaloob ng Diyos"
        title={
          <>
            A gift from God,
            <br className="hidden sm:block" /> and the two who found it
          </>
        }
        intro={
          <p>
            The hashtag arrived before the venue did, and it has been the loveliest summary of these
            two ever since.
          </p>
        }
      />

      <Section>
        <div className="container grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="The hashtag"
              /* break-all, not the base break-word: only the former reduces
                 min-content width, and this heading sits in a grid item whose
                 min-width is auto. Without it the hashtag sets a 492px floor
                 and scrolls the whole page sideways at 375px. */
              title={<span className="break-all">{SITE.hashtag}</span>}
              intro={
                <>
                  <p>
                    Read it slowly and it comes apart into &ldquo;Carlo, kaloob ng Diyos kay
                    Kristinne&rdquo;. Carlo, a gift from God to Kristinne. It was one of two
                    candidates. The other one, #iTINNEkdaNgdiyoskayCARLO, pointed the gift the other
                    way.
                  </p>
                  <p className="mt-4">
                    Somebody pointed out that it only points one way. Somebody else pointed out
                    that either version would be. They kept it anyway, and the vote was unanimous
                    within about four minutes, which is faster than any other decision in this entire
                    wedding.
                  </p>
                </>
              }
            />
          </div>

          <Reveal delay={120} className="lg:col-span-5">
            <Card className="border-brand-violet-600/30">
              <p className="eyebrow">In their own words</p>
              <blockquote className="mt-5 font-display text-display-md leading-tight">
                &ldquo;Ilabas namin kung sino talaga kami: makulit, masayahin, simple lang, at enjoy
                lang lahat.&rdquo;
              </blockquote>
              <p className="mt-5 text-sm leading-relaxed text-brand-ink/70">
                Loosely: let us just be who we actually are. Playful, cheerful, simple, and everyone
                enjoying themselves. That sentence is the brief for the whole day, and it is why this
                website does not try to be solemn.
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="container">
          <SectionHeading
            index="02"
            eyebrow="What matters to them"
            title="Three things, in order"
            intro={
              <p>
                They wrote these down before booking anything, which is the single most sensible
                thing a couple can do.
              </p>
            }
          />

          <ul className="mt-12 grid gap-5 sm:grid-cols-3">
            {VALUES.map((value, index) => (
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

      <Section>
        <div className="container">
          <SectionHeading
            index="03"
            eyebrow="Still being written"
            title="How they met, and how he asked"
          />

          <Reveal delay={80}>
            <PendingBlock
              className="mx-auto mt-12 max-w-2xl"
              title="Carlo and Kristinne are writing this part themselves"
              note="The proposal, the first date and everything in between are still to come. When Carlo and Kristinne send the words, this section fills itself in. If you know a story they have left out, tell Erick."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <Reveal key={index} delay={index * 80}>
                <PhotoFrame
                  alt=""
                  aspect="3/4"
                  tone={index}
                  sizes="(min-width: 640px) 25vw, 50vw"
                  placeholderLabel="Photo to come"
                />
              </Reveal>
            ))}
          </div>

          <Reveal delay={240}>
            <p className="mt-8 text-center text-sm text-brand-ink/60">
              Photographs go up as soon as the prenup shoot happens. Tag anything you already have
              with{" "}
              <span className="aurora-text font-semibold">{SITE.hashtag}</span>.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="container text-center">
          <Reveal>
            <Link href="/entourage" className="btn-outline">
              Meet the people standing with them
            </Link>
          </Reveal>
        </div>
      </Section>

      <CtaBanner
        title="Be in the room"
        body="Photographs are lovely, but they would much rather have you there in person."
      />
    </>
  );
}
