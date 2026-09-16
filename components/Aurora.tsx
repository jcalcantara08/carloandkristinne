import { cn } from "@/lib/utils";

/**
 * The wash.
 *
 * Two very large, very soft radial blooms, one blue and one violet, drifting
 * a few percent over half a minute. On the white ground this reads as
 * watercolour bleeding into paper rather than as light in a night sky, which
 * is the whole point of the palette flip.
 *
 * Entirely decorative: aria-hidden, pointer-events-none, and stopped by the
 * blanket prefers-reduced-motion rule in globals.css.
 *
 * `intensity` exists because the homepage hero wants the full effect and an
 * interior page wants a suggestion of it.
 */
export function Aurora({
  intensity = "full",
  className,
}: {
  intensity?: "full" | "soft";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        intensity === "full" ? "opacity-100" : "opacity-60",
        className,
      )}
    >
      {/* Blue, upper left. */}
      <div className="absolute -left-[18%] -top-[28%] h-[42rem] w-[42rem] animate-drift rounded-full bg-[radial-gradient(circle,rgba(58,85,217,0.16)_0%,rgba(58,85,217,0.06)_42%,transparent_70%)] blur-3xl" />
      {/* Violet, lower right. */}
      <div className="absolute -bottom-[32%] -right-[16%] h-[46rem] w-[46rem] animate-drift-alt rounded-full bg-[radial-gradient(circle,rgba(139,63,212,0.15)_0%,rgba(139,63,212,0.05)_44%,transparent_70%)] blur-3xl" />
      {/* A faint horizon wash, so the two blooms read as one field. */}
      <div className="absolute inset-x-0 top-1/3 h-64 bg-[linear-gradient(180deg,transparent,rgba(58,85,217,0.035),transparent)]" />
    </div>
  );
}

/**
 * The light beam. A single hairline of aurora gradient, vertical.
 * Used once per page as a spine, never twice.
 */
export function LightBeam({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("rule-v pointer-events-none absolute", className)} />;
}
