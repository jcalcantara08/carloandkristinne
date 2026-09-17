import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { GuestbookForm } from "@/components/forms/GuestbookForm";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { listGuestbook } from "@/lib/store";
import { getContent } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMeta({
  title: "Guestbook",
  description:
    "Leave a message for Carlo and Kristinne, and read what everyone else has written.",
  path: "/guestbook",
});

export default async function GuestbookPage() {
  const [entries, { guestbook }] = await Promise.all([listGuestbook("approved"), getContent()]);

  return (
    <>
      <PageHeader
        eyebrow={guestbook.eyebrow}
        title={guestbook.title}
        intro={guestbook.intro ? <p>{guestbook.intro}</p> : undefined}
        photos={guestbook.headerPhotos}
      />

      <Section>
        <div className="container">
          <Reveal>
            <Card className="mx-auto max-w-2xl p-6 sm:p-8">
              <GuestbookForm />
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="container">
          <SectionHeading
            eyebrow={entries.length === 1 ? "One message so far" : `${entries.length} messages so far`}
            title={guestbook.wallTitle}
          />

          {entries.length > 0 ? (
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry, index) => (
                <Reveal as="li" key={entry.id} delay={Math.min(index, 8) * 80}>
                  <Card hover className="flex h-full flex-col">
                    <Quote className="h-5 w-5 text-brand-plum-500" aria-hidden="true" />
                    <blockquote className="mt-4 flex-1 whitespace-pre-line text-sm leading-relaxed text-brand-ink/75">
                      {entry.message}
                    </blockquote>
                    <footer className="mt-5 border-t border-brand-line pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink/60">
                        {entry.name}
                      </p>
                      <p className="mt-1 text-xs text-brand-ink/60">
                        {formatDate(entry.createdAt)}
                      </p>
                    </footer>
                  </Card>
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal delay={80}>
              <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-brand-line-strong bg-brand-paper-200 p-10 text-center">
                <Quote className="mx-auto h-6 w-6 text-brand-plum-500" aria-hidden="true" />
                <p className="mt-4 font-display text-display-md">{guestbook.emptyTitle}</p>
                {guestbook.emptyBody ? (
                  <p className="mt-3 text-sm leading-relaxed text-brand-ink/70">{guestbook.emptyBody}</p>
                ) : null}
              </div>
            </Reveal>
          )}
        </div>
      </Section>

      <CtaBanner
        title={guestbook.ctaTitle}
        body={guestbook.ctaBody}
        secondary={{ href: "/gallery", label: "See the album" }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Guestbook", path: "/guestbook" },
            ]),
          ),
        }}
      />
    </>
  );
}
