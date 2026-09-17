import { cn } from "@/lib/utils";
import { COUPLE, SITE } from "@/lib/constants";

/**
 * The monogram: KC, the initials in the order the printed invitation has
 * them, inside a ring whose stroke runs plum into dusty blue (the invitation
 * sets its KC in plum with a blue-grey laurel), turning once every
 * twenty-four seconds.
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
      aria-label={`${COUPLE.bride.firstName} and ${COUPLE.groom.shortName}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-ring-spin rounded-full bg-[conic-gradient(from_0deg,#5A3D78,#7A97B3,#5A3D78)] [mask:radial-gradient(farthest-side,transparent_calc(100%-1.5px),#000_calc(100%-1.5px))]"
      />
      <span
        aria-hidden="true"
        className={cn(
          "font-display leading-none",
          on === "ink" ? "text-brand-paper" : "text-brand-ink",
        )}
      >
        {SITE.monogram[0]}
        <span className={cn("-ml-[0.08em]", on === "ink" ? "text-brand-mauve-300" : "text-brand-mauve-500")}>
          {SITE.monogram[1]}
        </span>
      </span>
    </span>
  );
}
