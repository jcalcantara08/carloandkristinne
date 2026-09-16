import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

/**
 * The section wrapper and its heading.
 *
 * Centred by default. The earlier build left-aligned everything and hung
 * ghosted folio numerals in the margin to avoid looking like a template; the
 * client's verdict was that it looked ugly, and the research across two dozen
 * well-liked wedding sites (17 September 2026) found centred, classic and
 * generously spaced every time. So: an eyebrow, a serif title, a short rule,
 * an intro, all centred, and nothing decorative around them.
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
   * `tint` is the faint ice-blue wash that separates two adjacent paper
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
  eyebrow,
  title,
  intro,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <Reveal className={cn("relative", centered && "mx-auto max-w-2xl text-center", className)}>
      <p className={cn(centered && "flex justify-center")}>
        <span className="eyebrow">{eyebrow}</span>
      </p>

      <h2 className={cn("mt-4 text-display-lg", !centered && "max-w-2xl")}>{title}</h2>

      {/* The only horizontal divider used site-wide. */}
      <div aria-hidden="true" className={cn("rule mt-6", centered && "mx-auto")} />

      {intro ? <div className={cn("prose-body mt-6", centered && "mx-auto")}>{intro}</div> : null}
    </Reveal>
  );
}
