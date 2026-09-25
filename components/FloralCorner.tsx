import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The bouquet from the printed cards, in a corner.
 *
 * The site's one piece of ornament, approved by Erick on 25 September 2026
 * from a mockup and made bolder on 26 September, because at the first
 * opacities he could not see it on a phone at all. It is cut from
 * `photos-master/florals/` on saturation (the damask ground of the card is
 * near neutral, the flowers are not) and faded towards the middle of the
 * page, so it dissolves instead of ending on a straight edge.
 *
 * Decorative, so it carries no alt text. The section it sits in has to be
 * `relative overflow-hidden`, or the negative offset starts a sideways
 * scroll on a phone.
 */
export function FloralCorner({
  side = "right",
  className,
}: {
  /** Which corner. `left` flips the bouquet so it still faces into the page. */
  side?: "left" | "right";
  className?: string;
}) {
  return (
    <Image
      src="/floral-corner.webp"
      alt=""
      aria-hidden="true"
      width={560}
      height={725}
      priority
      className={cn(
        "pointer-events-none absolute top-0 select-none",
        side === "left" ? "left-0 -scale-x-100" : "right-0",
        className,
      )}
    />
  );
}
