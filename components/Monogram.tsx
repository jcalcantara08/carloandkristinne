import Image from "next/image";
import { COUPLE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The couple's own monogram: the KC mark from their invitation suite, which
 * Erick filed on 25 September 2026. Plum letters, a blue-grey laurel through
 * the C, and the names beneath in the `lockup` variant.
 *
 * Two artworks rather than one, because the dark band needs the letters in
 * paper and the laurel in steel, and a CSS filter that turns the mark white
 * flattens the laurel into the letters. Both are cut from the same master
 * (`photos-master/logo/`), with the white knocked out to alpha so the mark
 * sits on the ice tint without a rectangle around it.
 *
 * It replaced a typographic KC in a spinning ring, which was a stand-in from
 * before the real mark existed. Do not put the ring back.
 */

const ART = {
  mark: { paper: "/logo-mark.png", ink: "/logo-mark-paper.png", width: 640, height: 484 },
  lockup: { paper: "/logo-lockup.png", ink: "/logo-lockup-paper.png", width: 1200, height: 1171 },
} as const;

export function Monogram({
  size = "md",
  on = "paper",
  variant = "mark",
  className,
}: {
  size?: "sm" | "md" | "lg";
  /** `ink` is for use inside the dark band, where the letters go to paper. */
  on?: "paper" | "ink";
  /** `lockup` adds the couple's names under the mark. */
  variant?: "mark" | "lockup";
  className?: string;
}) {
  const art = ART[variant];
  // Height drives the size; the mark is half again as wide as it is tall.
  const height = {
    mark: { sm: "h-9", md: "h-14", lg: "h-24" },
    lockup: { sm: "h-16", md: "h-24", lg: "h-36" },
  }[variant][size];

  return (
    <Image
      src={on === "ink" ? art.ink : art.paper}
      alt={`${COUPLE.bride.firstName} and ${COUPLE.groom.shortName}`}
      width={art.width}
      height={art.height}
      // The header shows it on the first paint, and it is never large.
      priority={size === "sm"}
      className={cn("w-auto select-none", height, className)}
    />
  );
}
