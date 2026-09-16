import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

/**
 * The interior-page header.
 *
 * Centred, on the faint ice-blue tint, with the same eyebrow, serif title,
 * rule and intro as every section heading, so the interior pages read as
 * chapters of the same book as the home page. Interior pages are shorter,
 * so this sits at a comfortable height instead of filling the viewport.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** The two CTAs, when the page needs them. */
  children?: ReactNode;
}) {
  return (
    <section className="bg-brand-paper-200 pb-14 pt-12 sm:pb-16 lg:pb-20 lg:pt-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="flex justify-center">
              <span className="eyebrow">{eyebrow}</span>
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-5 text-display-xl">{title}</h1>
          </Reveal>

          <Reveal delay={120}>
            <div aria-hidden="true" className="rule mx-auto mt-7" />
          </Reveal>

          {intro ? (
            <Reveal delay={160}>
              <div className="prose-body mx-auto mt-6">{intro}</div>
            </Reveal>
          ) : null}

          {children ? (
            <Reveal delay={240}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {children}
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
