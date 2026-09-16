import { cn } from "@/lib/utils";
import { COUPLE } from "@/lib/constants";

/**
 * The monogram: the couple's initials inside a ring whose stroke is the
 * steel-to-cornflower gradient, turning once every twenty-four seconds. It is the site's
 * one piece of iconography and it stands in for a logo the couple do not have.
 *
 * The ring is a conic-gradient disc masked to a hairline annulus, which keeps
 * it to two elements and zero images.
 */
export function Monogram({
  size = "md",
  on = "paper",
  className,
}: {
  size?: "sm" | "md" | "lg";
  /** `ink` is for use inside the dark band, where the initials invert. */
  on?: "paper" | "ink";
  className?: string;
}) {
  const dimensions = {
    sm: "h-10 w-10 text-sm",
    md: "h-16 w-16 text-lg",
    lg: "h-28 w-28 text-3xl",
  }[size];

  return (
    <span
      className={cn("relative inline-grid shrink-0 place-items-center", dimensions, className)}
      role="img"
      aria-label={`${COUPLE.groom.shortName} and ${COUPLE.bride.firstName}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-ring-spin rounded-full bg-[conic-gradient(from_0deg,#3B5068,#6B8BC9,#3B5068)] [mask:radial-gradient(farthest-side,transparent_calc(100%-1.5px),#000_calc(100%-1.5px))]"
      />
      <span
        aria-hidden="true"
        className={cn(
          "font-display leading-none",
          on === "ink" ? "text-brand-paper" : "text-brand-ink",
        )}
      >
        C
        <span
          className={cn(
            "mx-0.5 align-middle text-[0.6em]",
            on === "ink" ? "text-brand-cornflower-300" : "text-brand-cornflower-500",
          )}
        >
          &amp;
        </span>
        K
      </span>
    </span>
  );
}
