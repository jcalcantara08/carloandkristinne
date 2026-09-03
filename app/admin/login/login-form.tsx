"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { signIn } from "@/app/admin/login/actions";
import { Input, Label } from "@/components/ui/Field";
import { FormStatus } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { IDLE, type ActionState } from "@/lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Signing in
        </>
      ) : (
        "Sign in"
      )}
    </Button>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(signIn, IDLE);
  const id = useId();

  return (
    <form action={formAction} className="space-y-5">
      <FormStatus state={state} />

      <input type="hidden" name="next" value={next} />

      <div>
        <Label htmlFor={id} required>
          Password
        </Label>
        <Input
          id={id}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          // Pasting must work. Blocking it fails WCAG 2.2 (3.3.8).
          maxLength={200}
        />
      </div>

      <SubmitButton />

      <p className="text-xs leading-relaxed text-brand-ink/60">
        The session lasts eight hours. Sign out from the dashboard when you are done on a shared
        device.
      </p>
    </form>
  );
}
