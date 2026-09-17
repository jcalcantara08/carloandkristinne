import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import type { StoryPhoto } from "@/lib/content-schema";
import { cn } from "@/lib/utils";

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
  photos,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** The two CTAs, when the page needs them. */
  children?: ReactNode;
  /** One photograph is a wide band under the heading; two are a pair. */
  photos?: StoryPhoto[];
}) {
  const shown = (photos ?? []).filter((photo) => photo.src).slice(0, 2);
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

        {shown.length > 0 ? (
          <Reveal delay={280}>
            <div
              className={cn(
                "mx-auto mt-12 lg:mt-14",
                shown.length > 1 ? "grid max-w-4xl gap-4 sm:grid-cols-2 sm:gap-5" : "max-w-5xl",
              )}
            >
              {shown.map((photo) => (
                <div
                  key={photo.src}
                  className={cn(
                    "relative overflow-hidden rounded-3xl border border-brand-line bg-brand-paper-100 shadow-soft",
                    shown.length > 1 ? "aspect-[4/5]" : "aspect-[3/2] lg:aspect-[21/9]",
                  )}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    priority
                    sizes={shown.length > 1 ? "(min-width: 640px) 50vw, 100vw" : "100vw"}
                    className="object-cover object-[50%_28%]"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
