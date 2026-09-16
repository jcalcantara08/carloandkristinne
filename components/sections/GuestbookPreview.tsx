import Link from "next/link";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/Section";
import { Card } from "@/components/ui/Card";
import type { GuestbookEntry } from "@/lib/types";
import { getContent } from "@/lib/content";

/**
 * Wishes from guests, immediately before the final CTA.
 *
 * This is the wedding equivalent of the testimonial slot in the house page
 * arc: social proof as the closing argument, never buried mid-page.
 */
export async function GuestbookPreview({ entries }: { entries: GuestbookEntry[] }) {
  const { home } = await getContent();
  return (
    <Section on="tint">
      <div className="container">
        <SectionHeading
          eyebrow={home.wishesEyebrow}
          title={home.wishesTitle}
          align="center"
          intro={home.wishesIntro ? <p>{home.wishesIntro}</p> : undefined}
        />

        {entries.length > 0 ? (
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, index) => (
              <Reveal as="li" key={entry.id} delay={index * 80}>
                <Card className="flex h-full flex-col">
                  <Quote className="h-5 w-5 text-brand-steel-500" aria-hidden="true" />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-brand-ink/75">
                    {entry.message}
                  </blockquote>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-brand-ink/60">
                    {entry.name}
                  </p>
                </Card>
              </Reveal>
            ))}
          </ul>
        ) : (
          <Reveal delay={80}>
            <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-brand-line-strong bg-brand-paper-200 p-10 text-center">
              <Quote className="mx-auto h-6 w-6 text-brand-steel-500" aria-hidden="true" />
              <p className="mt-4 font-display text-display-md">Nobody has written yet</p>
              <p className="mt-3 text-sm leading-relaxed text-brand-ink/70">
                Which means the first message on this wall could be yours.
              </p>
            </div>
          </Reveal>
        )}

        <Reveal delay={160}>
          <div className="mt-10 text-center">
            <Link href="/guestbook" className="btn-outline">
              Leave a message
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
