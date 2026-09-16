import { CalendarDays, Church, PartyPopper, Shirt } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { getContent } from "@/lib/content";

/**
 * The proof strip, directly under the hero.
 *
 * Its job is to pay off the hero's claim before asking for more scroll:
 * four facts a guest needs before anything else, above the fold on a laptop.
 */
const ICONS = [CalendarDays, Church, PartyPopper, Shirt];

export async function AtAGlance() {
  const { home } = await getContent();
  const FACTS = home.glance.map((fact, index) => ({ ...fact, icon: ICONS[index] ?? CalendarDays }));

  return (
    <section className="relative border-y border-brand-line bg-brand-paper-200">
      <ul className="container grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map((fact, index) => (
          <Reveal
            as="li"
            key={fact.label}
            delay={index * 80}
            className="flex items-start gap-4 py-7 sm:py-8 lg:px-6"
          >
            <fact.icon
              className="mt-0.5 h-5 w-5 shrink-0 text-brand-steel-500"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="text-[0.65rem] font-semibold uppercase tracking-eyebrow text-brand-ink/60">
                {fact.label}
              </p>
              <p className="mt-1.5 font-display text-xl text-brand-ink">{fact.value}</p>
              <p className="mt-0.5 text-xs text-brand-ink/60">{fact.note}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
