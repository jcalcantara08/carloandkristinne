import { Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pending as PendingValue } from "@/lib/constants";

/**
 * The placeholder system.
 *
 * A large part of this wedding is genuinely undecided, and the couple asked
 * for placeholders rather than invented detail. An empty state that reads as
 * intentional is worth far more than a plausible lie, so a missing fact
 * renders as a labelled chip that says what is missing and implies it is
 * coming, rather than as a blank or a made-up venue name.
 *
 * Everything here is driven by the `pending` flags in lib/constants.ts.
 * Filling in a value there removes the chip automatically.
 */

export function PendingChip({
  label = "To be confirmed",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-dashed border-brand-violet-600/60 bg-brand-violet-600/10 px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-wider text-brand-violet-500",
        className,
      )}
    >
      <Clock3 className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}

/**
 * Render a value, or the chip when it is still pending.
 * `label` lets a caller be specific: "Venue to be confirmed".
 */
export function Value({
  of,
  label,
  className,
}: {
  of: PendingValue<string>;
  label?: string;
  className?: string;
}) {
  if (of.pending) return <PendingChip label={label} className={className} />;
  return <span className={className}>{of.value}</span>;
}

/**
 * A whole block that is not written yet. Used for sponsor lists and the
 * couple's story, both of which are still being gathered.
 */
export function PendingBlock({
  title,
  note,
  className,
}: {
  title: string;
  note: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-dashed border-brand-line-strong bg-brand-paper-200 p-8 text-center",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.10),transparent_65%)]"
      />
      <div className="relative">
        <PendingChip />
        <h3 className="mt-4 text-display-md">{title}</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-brand-ink/70">{note}</p>
      </div>
    </div>
  );
}
