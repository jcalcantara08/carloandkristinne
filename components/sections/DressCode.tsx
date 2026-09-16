import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/Section";
import { ATTIRE_PALETTE, DRESS_CODE, DRESS_NOTE } from "@/lib/constants";

/**
 * The dress code, which is also the clearest statement of the site's palette.
 *
 * The swatch is never the only cue: every row names its colour in words, so
 * the table works for a colour-blind guest and in a screen reader.
 */
export function DressCode() {
  return (
    <Section id="dress-code" on="tint">
      <div className="container">
        <SectionHeading
          eyebrow="What to wear"
          title="The blues, and white is theirs"
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

        {/* The five blues, named exactly as on the attire guides the couple
            sent, so a guest can hold a dress or a tie up against them. */}
        <Reveal delay={480}>
          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap items-start justify-center gap-x-8 gap-y-6">
            {ATTIRE_PALETTE.map((swatch) => (
              <li key={swatch.name} className="flex w-24 flex-col items-center text-center">
                <span
                  aria-hidden="true"
                  className="h-12 w-12 rounded-full border border-brand-line-strong"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span className="mt-2 text-xs leading-snug text-brand-ink/65">{swatch.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
