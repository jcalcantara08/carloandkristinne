import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { ActionState } from "@/lib/types";

/**
 * The single place a form reports back.
 *
 * aria-live so a screen reader hears the result without moving focus, and
 * the state is carried by an icon and words as well as by colour.
 */
export function FormStatus({ state }: { state: ActionState }) {
  if (state.status === "idle") {
    return <div aria-live="polite" className="sr-only" />;
  }

  const success = state.status === "success";

  return (
    <div
      aria-live="polite"
      role="status"
      className={
        success
          ? "flex items-start gap-3 rounded-xl border border-brand-cornflower-600/50 bg-brand-cornflower-600/10 px-4 py-3 text-sm text-brand-cornflower-600"
          : "flex items-start gap-3 rounded-xl border border-brand-steel-600/50 bg-brand-steel-600/10 px-4 py-3 text-sm text-brand-steel-600"
      }
    >
      {success ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <p>{state.message}</p>
    </div>
  );
}

/** The honeypot. Hidden from sight and from assistive tech, but present in the DOM. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="website">Do not fill this in</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
