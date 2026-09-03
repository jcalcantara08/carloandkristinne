import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

/**
 * The section wrapper and its heading.
 *
 * The index number is borrowed from the couple's own planning workbook, which
 * numbers its chapters 00 to 06. Here it is set as a large ghosted folio
 * numeral hanging in the left margin, the way a magazine numbers a spread.
 * That, the ribbon and the asymmetric hero are the three things stopping this
 * site from looking like every other wedding template.
 */

export function Section({
  children,
  className,
  id,
  on = "paper",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  /**
   * `ink` is the single dark contrast band. One per page, never two.
   * `tint` is a very faint wash used to separate two adjacent paper
   * sections without introducing a second dark band.
   */
  on?: "paper" | "tint" | "ink";
}) {
  return (
    <section
      id={id}
      className={cn(
        "section relative",
        on === "ink" && "on-ink",
        on === "tint" && "bg-brand-paper-200",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  align = "left",
  on = "paper",
  className,
}: {
  /** Two digits, e.g. "03". Rendered as the folio numeral. */
  index?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  on?: "paper" | "ink";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <Reveal className={cn("relative", centered && "text-center", className)}>
      {/* The folio numeral. Hangs in the margin on large screens, where
          there is room for it; inline and small on everything else. */}
      {index ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none select-none font-display leading-none",
            /* The hanging position is 2xl only, not lg. The container caps
               at 1200px, so below the 1536px breakpoint there is not enough
               gutter for a -6rem offset and it would push the page into a
               horizontal scroll. */
            centered
              ? "mb-3 block text-5xl"
              : "mb-4 block text-5xl 2xl:absolute 2xl:-left-24 2xl:-top-6 2xl:mb-0 2xl:text-[7rem]",
            on === "ink" ? "text-brand-paper/25" : "text-brand-ink/15",
          )}
        >
          {index}
        </span>
      ) : null}

      <p className={cn(centered && "flex justify-center")}>
        <span className="eyebrow">{eyebrow}</span>
      </p>

      <h2 className="mt-4 max-w-2xl text-display-lg">{title}</h2>

      {/* The only horizontal divider we use site-wide. */}
      <div aria-hidden="true" className={cn("rule mt-6", centered && "mx-auto")} />

      {intro ? <div className={cn("prose-body mt-6", centered && "mx-auto")}>{intro}</div> : null}
    </Reveal>
  );
}
