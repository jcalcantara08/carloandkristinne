import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { pageMeta } from "@/lib/seo";
import { getContent } from "@/lib/content";

/**
 * The gift page (Erick, 7 October 2026). First unlisted, then put in the menu
 * the same day at Erick's request. It stays noindex and out of the sitemap,
 * so a search for the couple's names does not surface the payment QR. The words are the printed
 * "Wedding Gift Note" card; the QR is the couple's InstaPay code, decoded and
 * checked before it went up. Both are editable under Edit the website, Gifts.
 */
export const metadata: Metadata = pageMeta({
  title: "Gifts",
  description: "A note from Carlo and Kristinne about gifts.",
  path: "/gifts",
  noIndex: true,
});

export default async function GiftsPage() {
  const { gifts } = await getContent();

  return (
    <>
      <PageHeader eyebrow={gifts.eyebrow} title={gifts.title} intro={gifts.intro ? <p>{gifts.intro}</p> : undefined} />

      <Section>
        <div className="container">
          <Reveal>
            <Card className="mx-auto max-w-xl p-6 text-center sm:p-10">
              {gifts.body ? <p className="text-base leading-relaxed text-brand-ink/80">{gifts.body}</p> : null}

              {gifts.qrImage ? (
                <div className="mt-8">
                  {/* A local file or an uploaded one; either way the image is shown as is, never cropped. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={gifts.qrImage}
                    alt={gifts.qrAlt}
                    width={452}
                    height={629}
                    className="mx-auto h-auto w-full max-w-xs rounded-xl border border-brand-line"
                  />
                  {gifts.qrNote ? <p className="mt-4 text-sm text-brand-ink/65">{gifts.qrNote}</p> : null}
                </div>
              ) : null}

              {gifts.thanks ? (
                <p className="mt-8 border-t border-brand-line pt-6 font-display text-xl leading-snug text-brand-ink">
                  {gifts.thanks}
                </p>
              ) : null}
            </Card>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
