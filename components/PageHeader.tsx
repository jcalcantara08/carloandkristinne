import type { ReactNode } from "react";
import { Aurora } from "@/components/Aurora";
import { Reveal } from "@/components/Reveal";

/**
 * The interior-page hero.
 *
 * Same editorial logic as the homepage hero: left-aligned, asymmetric, with
 * the index set as a large ghosted folio numeral rather than a small label.
 * Interior pages are shorter, so this sits at a comfortable height instead of
 * filling the viewport.
 */
export function PageHeader({
  index,
  eyebrow,
  title,
  intro,
  children,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** The two CTAs, when the page needs them. */
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-14 pt-12 sm:pb-16 lg:pb-20 lg:pt-16">
      <Aurora intensity="soft" />

      <div className="container relative">
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <Reveal>
              <div className="flex items-baseline gap-5">
                {index ? (
                  <span
                    aria-hidden="true"
                    className="select-none font-display text-5xl leading-none text-brand-ink/15 lg:text-6xl"
                  >
                    {index}
                  </span>
                ) : null}
                <span className="eyebrow">{eyebrow}</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-6 text-display-xl">{title}</h1>
            </Reveal>

            <Reveal delay={120}>
              <div aria-hidden="true" className="rule mt-8" />
            </Reveal>

            {intro ? (
              <Reveal delay={160}>
                <div className="prose-body mt-7">{intro}</div>
              </Reveal>
            ) : null}

            {children ? (
              <Reveal delay={240}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">{children}</div>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
