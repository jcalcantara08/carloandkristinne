"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { submitGuestbook } from "@/app/actions/guestbook";
import { FieldError, Hint, Input, Label, Textarea } from "@/components/ui/Field";
import { FormStatus, Honeypot } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { IDLE, type ActionState } from "@/lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Sending
        </>
      ) : (
        "Leave your message"
      )}
    </Button>
  );
}

export function GuestbookForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(submitGuestbook, IDLE);
  const ids = useId();
  const errors = state.status === "error" ? state.fieldErrors : undefined;
  const field = (name: string) => `${ids}-${name}`;

  return (
    <form action={formAction} className="relative space-y-6">
      <Honeypot />
      <FormStatus state={state} />

      <div>
        <Label htmlFor={field("name")} required>
          Your name
        </Label>
        <Input
          id={field("name")}
          name="name"
          autoComplete="name"
          required
          maxLength={80}
          aria-invalid={errors?.name ? true : undefined}
          aria-describedby={errors?.name ? field("name-error") : undefined}
          placeholder="How they know you"
        />
        <FieldError id={field("name-error")} messages={errors?.name} />
      </div>

      <div>
        <Label htmlFor={field("message")} required>
          Your message
        </Label>
        <Textarea
          id={field("message")}
          name="message"
          rows={5}
          required
          maxLength={800}
          aria-invalid={errors?.message ? true : undefined}
          aria-describedby={errors?.message ? field("message-error") : field("message-hint")}
          placeholder="A wish, a warning, or a story they would rather you did not tell"
        />
        <Hint id={field("message-hint")}>
          Up to 800 characters. Messages are read before they appear on the wall.
        </Hint>
        <FieldError id={field("message-error")} messages={errors?.message} />
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
