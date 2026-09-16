import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/Section";

/**
 * "What we do" in the house page arc, translated for a wedding: who these
 * two are, and why the hashtag means what it means.
 */
export function StoryPreview() {
  return (
    <Section>
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
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

      </div>
    </Section>
  );
}
