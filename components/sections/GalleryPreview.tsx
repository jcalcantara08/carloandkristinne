import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/Section";
import { PhotoFrame } from "@/components/PhotoFrame";
import type { Photo } from "@/lib/types";

export function GalleryPreview({ photos }: { photos: Photo[] }) {
  const shown = photos.slice(0, 6);
  const placeholders = Array.from({ length: Math.max(0, 6 - shown.length) }, (_, i) => i);

  return (
    <Section>
      <div className="container">
        <SectionHeading
          eyebrow="The album"
          title="Everything anyone photographs, in one place"
          intro={
            <p>
              From the day of the wedding onwards, anyone can add the photographs they took, and anyone
              can download them at full size. No app, no account, nothing to sign up for.
            </p>
          }
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
          {placeholders.map((index) => (
            <Reveal key={`placeholder-${index}`} delay={(shown.length + index) * 80}>
              <PhotoFrame
                alt=""
                aspect="1/1"
                tone={shown.length + index}
                sizes="(min-width: 640px) 33vw, 50vw"
                placeholderLabel="After the day"
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
