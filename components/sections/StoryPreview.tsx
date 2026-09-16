import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/Section";
import { getContent } from "@/lib/content";

/**
 * "What we do" in the house page arc, translated for a wedding: who these
 * two are, and why the hashtag means what it means.
 */
export async function StoryPreview() {
  const { home } = await getContent();
  return (
    <Section>
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            eyebrow={home.storyEyebrow}
            title={home.storyTitle}
            intro={
              <>
                {home.storyP1 ? <p>{home.storyP1}</p> : null}
                {home.storyP2 ? <p className="mt-4">{home.storyP2}</p> : null}
              </>
            }
          />

          <Reveal delay={160}>
            <Link href="/our-story" className="btn-outline mt-10">
              {home.storyLink || "Read the whole story"}
            </Link>
          </Reveal>
        </div>

      </div>
    </Section>
  );
}
