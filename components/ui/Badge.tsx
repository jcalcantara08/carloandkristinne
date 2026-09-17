import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wider",
  {
    variants: {
      tone: {
        neutral: "border-brand-line bg-brand-paper-100 text-brand-ink/70",
        pending: "border-brand-plum-600/50 bg-brand-plum-600/10 text-brand-plum-600",
        approved: "border-brand-mauve-600/50 bg-brand-mauve-600/10 text-brand-mauve-600",
        hidden: "border-brand-line-strong bg-brand-paper-200 text-brand-ink/60",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
