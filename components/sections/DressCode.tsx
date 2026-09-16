import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/Section";
import { ATTIRE_PALETTE, DRESS_CODE } from "@/lib/constants";
import { getContent } from "@/lib/content";

/**
 * The dress code, which is also the clearest statement of the site's palette.
 *
 * The swatch is never the only cue: every row names its colour in words, so
 * the table works for a colour-blind guest and in a screen reader.
 */
export async function DressCode() {
  const { details } = await getContent();
  // Swatches stay in code (they are the palette, not copy) and follow the
  // row's position; a row the couple add beyond the known ones gets the
  // last swatch rather than none. The outfit was added after the document
  // format existed, so a saved row without one falls back to the code
  // default for the same role rather than showing the colour alone.
  const rows = details.dressCode.map((row, index) => ({
    ...row,
    outfit: row.outfit || (DRESS_CODE.find((d) => d.role === row.role)?.outfit ?? ""),
    swatch: (DRESS_CODE[index] ?? DRESS_CODE[DRESS_CODE.length - 1]).swatch,
  }));
  return (
    <Section id="dress-code" on="tint">
      <div className="container">
        <SectionHeading
          eyebrow={details.dressEyebrow}
          title={details.dressTitle}
          intro={details.dressNote ? <p>{details.dressNote}</p> : undefined}
        />

        <ul className="mx-auto mt-12 grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-brand-line bg-brand-line sm:grid-cols-2">
          {rows.map((role, index) => (
            <Reveal
              as="li"
              key={role.role}
              delay={index * 80}
              className="flex items-start gap-4 bg-brand-paper-100 px-5 py-5"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 h-9 w-9 shrink-0 rounded-full border border-brand-line-strong"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${role.swatch.join(", ")})`,
                }}
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-brand-ink">{role.role}</span>
                <span className="mt-0.5 block text-xs font-medium uppercase tracking-wider text-brand-steel-500">
                  {role.colour}
                </span>
                {role.outfit ? (
                  <span className="mt-2 block text-sm leading-relaxed text-brand-ink/70">{role.outfit}</span>
                ) : null}
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
