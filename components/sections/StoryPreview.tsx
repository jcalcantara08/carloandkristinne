import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/Section";
import { PhotoFrame } from "@/components/PhotoFrame";

/**
 * "What we do" in the house page arc, translated for a wedding: who these
 * two are, and why the hashtag means what it means.
 */
export function StoryPreview() {
  return (
    <Section>
      <div className="container grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHeading
            align="left"
            eyebrow="Kaloob ng Diyos"
            title={
              <>
                A gift, and the two people
                <br className="hidden sm:block" /> lucky enough to find it
              </>
            }
            intro={
              <>
                <p>
                  The hashtag came before almost anything else. #CARLOobNgdiyoskayKRISTINNE reads as
                  &ldquo;Carlo, a gift from God to Kristinne&rdquo;, and the moment it was said out
                  loud, everyone knew that was the one.
                </p>
                <p className="mt-4">
                  That is the tone of the whole day. Makulit, masayahin, simple lang. They
                  have said plainly that they want the day to feel like them rather than look like a
                  magazine, and the three things worth spending on are the church moment, the food,
                  and the photographs.
                </p>
              </>
            }
          />

          <Reveal delay={160}>
            <Link href="/our-story" className="btn-outline mt-10">
              Read the whole story
            </Link>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:col-span-6">
          <div className="grid grid-cols-2 gap-4">
            <PhotoFrame
              alt="Carlo and Kristinne, portrait to come"
              aspect="4/5"
              tone={0}
              sizes="(min-width: 1024px) 25vw, 50vw"
              placeholderLabel="Prenup to come"
            />
            <PhotoFrame
              alt="Carlo and Kristinne, second portrait to come"
              aspect="4/5"
              tone={1}
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="mt-10"
              placeholderLabel="Prenup to come"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
