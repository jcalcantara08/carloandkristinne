import type { Metadata } from "next";
import { Camera, Download, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { GalleryGrid } from "@/components/GalleryGrid";
import { UploadForm } from "@/components/forms/UploadForm";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { listPhotos } from "@/lib/store";
import { getContent } from "@/lib/content";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "Gallery",
  description:
    "The shared album. Upload the photographs you took, and download anyone else's at full size.",
  path: "/gallery",
});

const HOW_ICONS = [Camera, ShieldCheck, Download];

export default async function GalleryPage() {
  const [photos, { gallery }] = await Promise.all([listPhotos("approved"), getContent()]);

  return (
    <>
      <PageHeader
        eyebrow={gallery.eyebrow}
        title={gallery.title}
        intro={gallery.intro ? <p>{gallery.intro}</p> : undefined}
      />

      {gallery.how.length > 0 ? (
        <Section>
          <div className="container">
            <ul className="grid gap-5 sm:grid-cols-3">
              {gallery.how.map((item, index) => {
                const Icon = HOW_ICONS[index] ?? Camera;
                return (
                  <Reveal as="li" key={item.title} delay={index * 80}>
                    <Card hover className="h-full">
                      <Icon className="h-5 w-5 text-brand-plum-500" aria-hidden="true" />
                      <h2 className="mt-4 text-lg font-medium text-brand-ink">{item.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">{item.body}</p>
                    </Card>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </Section>
      ) : null}

      <Section id="upload">
        <div className="container">
          <SectionHeading
            eyebrow={gallery.uploadEyebrow}
            title={gallery.uploadTitle}
            intro={
              <p>
                {gallery.uploadIntro}{" "}
                <span className="aurora-text font-semibold">{SITE.hashtag}</span>
              </p>
            }
          />

          <Reveal delay={80}>
            <Card className="mx-auto mt-12 max-w-2xl p-6 sm:p-8">
              <UploadForm />
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="container">
          <SectionHeading
            eyebrow={
              photos.length === 0
                ? "Waiting for the day"
                : photos.length === 1
                  ? "One photograph"
                  : `${photos.length} photographs`
            }
            title={gallery.albumTitle}
          />

          <div className="mt-12">
            {photos.length > 0 ? (
              <GalleryGrid photos={photos} />
            ) : (
              <Reveal delay={80}>
                <div className="mx-auto max-w-xl rounded-2xl border border-brand-line bg-brand-paper-200 p-10 text-center">
                  <Camera className="mx-auto h-6 w-6 text-brand-plum-500" aria-hidden="true" />
                  <p className="mt-4 font-display text-display-md">{gallery.emptyTitle}</p>
                  {gallery.emptyBody ? (
                    <p className="mt-3 text-sm leading-relaxed text-brand-ink/70">{gallery.emptyBody}</p>
                  ) : null}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </Section>

      <CtaBanner
        title={gallery.ctaTitle}
        body={gallery.ctaBody}
        secondary={{ href: "/guestbook", label: "Leave a message" }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Gallery", path: "/gallery" },
            ]),
          ),
        }}
      />
    </>
  );
}
