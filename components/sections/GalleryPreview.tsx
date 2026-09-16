import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/Section";
import { PhotoFrame } from "@/components/PhotoFrame";
import type { Photo } from "@/lib/types";
import { getContent } from "@/lib/content";

/**
 * Shown only once there is something to show. Before the wedding the album
 * is empty, and a grid of "coming soon" frames on the home page reads as
 * unfinished rather than anticipatory.
 */
export async function GalleryPreview({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;
  const { home } = await getContent();
  const shown = photos.slice(0, 6);

  return (
    <Section>
      <div className="container">
        <SectionHeading
          eyebrow={home.galleryEyebrow}
          title={home.galleryTitle}
          intro={home.galleryIntro ? <p>{home.galleryIntro}</p> : undefined}
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {shown.map((photo, index) => (
            <Reveal key={photo.id} delay={index * 80}>
              <PhotoFrame
                src={photo.publicUrl}
                alt={photo.caption ?? `Photograph from the wedding, uploaded by ${photo.uploaderName ?? "a guest"}`}
                aspect="1/1"
                tone={index}
                sizes="(min-width: 640px) 33vw, 50vw"
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={160}>
          <div className="mt-10 text-center">
            <Link href="/gallery" className="btn-outline">
              Open the album
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
