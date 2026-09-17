import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/Section";
import { ATTIRE_PALETTE, DRESS_CODE } from "@/lib/constants";
import { getContent } from "@/lib/content";

/**
 * The dress code, which is also the clearest statement of the site's palette.
 *
 * Each card shows the guide's own illustration of the outfit where there is
 * one, the colour in words, and the garments in words, so the card works
 * for a colour-blind guest and in a screen reader.
 *
 * The words come from the site document. The illustrations and swatches
 * stay in code, matched by role name. A role that exists in code but not in
 * the saved document (the principal sponsors were added after the first
 * save) is appended in its code position, so a new guide reaches the live
 * site without anyone re-saving the page.
 */
export async function DressCode() {
  const { details } = await getContent();
  const stored = details.dressCode;
  const rows = DRESS_CODE.map((code) => {
    const saved = stored.find((row) => row.role === code.role);
    return {
      role: code.role,
      colour: saved?.colour || code.colour,
      outfit: saved?.outfit || code.outfit,
      figure: code.figure,
      swatch: code.swatch,
    };
  });
  // Rows the couple added themselves, beyond the known roles.
  for (const row of stored) {
    if (!rows.some((known) => known.role === row.role)) {
      rows.push({ ...row, figure: "", swatch: DRESS_CODE[DRESS_CODE.length - 1].swatch });
    }
  }

  return (
    <Section id="dress-code" on="tint">
      <div className="container">
        <SectionHeading
          eyebrow={details.dressEyebrow}
          title={details.dressTitle}
          intro={details.dressNote ? <p>{details.dressNote}</p> : undefined}
        />

        <ul className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((role, index) => (
            <Reveal
              as="li"
              key={role.role}
              delay={Math.min(index, 6) * 80}
              className="flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-brand-paper-100"
            >
              <div className="relative aspect-[4/3] bg-brand-paper">
                {role.figure ? (
                  <Image
                    src={role.figure}
                    alt={`The ${role.role.toLowerCase()} outfit, as drawn on the attire guide.`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-4"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-line-strong"
                    style={{ backgroundImage: `linear-gradient(135deg, ${role.swatch.join(", ")})` }}
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col px-5 py-5">
                <span className="block font-display text-xl text-brand-ink">{role.role}</span>
                <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-brand-steel-500">
                  {role.colour}
                </span>
                {role.outfit ? (
                  <span className="mt-3 block text-sm leading-relaxed text-brand-ink/70">{role.outfit}</span>
                ) : null}
              </div>
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
