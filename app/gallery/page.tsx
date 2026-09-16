import type { Metadata } from "next";
import { Camera, Download, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Card } from "@/components/ui/Card";
import { PhotoFrame } from "@/components/PhotoFrame";
import { GalleryGrid } from "@/components/GalleryGrid";
import { UploadForm } from "@/components/forms/UploadForm";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { listPhotos } from "@/lib/store";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "Gallery",
  description:
    "The shared album. Upload the photographs you took, and download anyone else's at full size.",
  path: "/gallery",
});

const HOW = [
  {
    icon: Camera,
    title: "Anyone can add",
    body: "No app and no account needed. Just choose the photographs from your phone and send them.",
  },
  {
    icon: ShieldCheck,
    title: "Checked first",
    body: "Carlo and Kristinne see everything before it appears, which keeps the album lovely for everyone.",
  },
  {
    icon: Download,
    title: "Anyone can take",
    body: "Every photograph in the album downloads at its original size, and the links never expire.",
  },
];

export default async function GalleryPage() {
  const photos = await listPhotos("approved");

  return (
    <>
      <PageHeader
        eyebrow="The shared album"
        title="Everything, from everyone"
        intro={
          <p>
            The photographers will cover the day beautifully. This is for everything they cannot be
            in two places for, which is often the best of it.
          </p>
        }
      />

      <Section>
        <div className="container">
          <ul className="grid gap-5 sm:grid-cols-3">
            {HOW.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 80}>
                <Card hover className="h-full">
                  <item.icon className="h-5 w-5 text-brand-steel-500" aria-hidden="true" />
                  <h2 className="mt-4 text-lg font-medium text-brand-ink">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">{item.body}</p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="upload">
        <div className="container">
          <SectionHeading
            eyebrow="Add yours"
            title="Upload what you took"
            intro={
              <p>
                Tag anything you post elsewhere with{" "}
                <span className="aurora-text font-semibold">{SITE.hashtag}</span> so it can be found
                later.
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
            title="The album"
          />

          <div className="mt-12">
            {photos.length > 0 ? (
              <GalleryGrid photos={photos} />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                    <Reveal key={index} delay={Math.min(index, 8) * 80}>
                      <PhotoFrame
                        alt=""
                        aspect="1/1"
                        tone={index}
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        placeholderLabel="17 October"
                      />
                    </Reveal>
                  ))}
                </div>
                <Reveal delay={240}>
                  <p className="mt-8 text-center text-sm text-brand-ink/60">
                    The album stays empty until the wedding. Come back on the seventeenth, or any time
                    after, and it will not be.
                  </p>
                </Reveal>
              </>
            )}
          </div>
        </div>
      </Section>

      <CtaBanner
        title="First, the small matter of your reply"
        body="The album will happily wait for you. The caterer, sadly, cannot."
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
