import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Every input has a real, visible, associated label. A placeholder is not a
 * label, and errors are announced in text rather than signalled by colour.
 */

export function Label({
  className,
  required,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label className={cn("field-label", className)} {...props}>
      {children}
      {required ? (
        <span className="ml-1 text-brand-plum-500" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}

export function Hint({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("field-hint", className)} {...props} />;
}

export function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return (
    <p className="field-error" id={id}>
      <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{messages.join(" ")}</span>
    </p>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn("field", className)} {...props} />;
  },
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn("field min-h-[7rem] resize-y", className)} {...props} />;
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, ...props }, ref) {
  return <select ref={ref} className={cn("field appearance-none pr-10", className)} {...props} />;
});
