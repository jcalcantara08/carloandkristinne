import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/Section";
import { DRESS_CODE, DRESS_NOTE } from "@/lib/constants";

/**
 * The dress code, which is also the clearest statement of the site's palette.
 *
 * The swatch is never the only cue: every row names its colour in words, so
 * the table works for a colour-blind guest and in a screen reader.
 */
export function DressCode({ index = "03" }: { index?: string }) {
  return (
    <Section id="dress-code" on="tint">
      <div className="container">
        <SectionHeading
          index={index}
          eyebrow="What to wear"
          title="Blue, violet, black. White is theirs."
          align="center"
          intro={<p>{DRESS_NOTE}</p>}
        />

        <ul className="mx-auto mt-12 grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-brand-line bg-brand-line sm:grid-cols-2">
          {DRESS_CODE.map((role, index) => (
            <Reveal
              as="li"
              key={role.role}
              delay={index * 80}
              className="flex items-center gap-4 bg-brand-paper-100 px-5 py-5"
            >
              <span
                aria-hidden="true"
                className="h-9 w-9 shrink-0 rounded-full border border-brand-line-strong"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${role.swatch.join(", ")})`,
                }}
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-brand-ink">{role.role}</span>
                <span className="mt-0.5 block text-xs text-brand-ink/60">{role.colour}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
