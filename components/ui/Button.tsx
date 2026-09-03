import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("btn disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      primary: "btn-primary",
      outline: "btn-outline",
      primaryInverse: "btn-primary-inverse",
      outlineInverse: "btn-outline-inverse",
      ghost:
        "text-brand-ink/75 hover:text-brand-ink hover:bg-brand-paper-200 focus-visible:ring-offset-brand-paper",
    },
    size: {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

type BaseProps = VariantProps<typeof buttonVariants> & { className?: string };

export type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export type ButtonLinkProps = BaseProps &
  React.ComponentPropsWithoutRef<typeof Link> & { external?: boolean };

export function ButtonLink({ className, variant, size, external, ...props }: ButtonLinkProps) {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...externalProps}
      {...props}
    />
  );
}

export { buttonVariants };
