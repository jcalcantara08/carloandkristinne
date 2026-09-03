"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { submitRsvp } from "@/app/actions/rsvp";
import { FieldError, Hint, Input, Label, Select, Textarea } from "@/components/ui/Field";
import { FormStatus, Honeypot } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { RSVP } from "@/lib/constants";
import { IDLE, type ActionState } from "@/lib/types";

function SubmitButton({ attending }: { attending: "yes" | "no" }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Sending
        </>
      ) : attending === "yes" ? (
        "Yes, count us in"
      ) : (
        "Send my reply"
      )}
    </Button>
  );
}

export function RsvpForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(submitRsvp, IDLE);
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const ids = useId();

  const errors = state.status === "error" ? state.fieldErrors : undefined;
  const field = (name: string) => `${ids}-${name}`;

  // On success the form is replaced by the confirmation, so nobody
  // accidentally submits twice.
  if (state.status === "success") {
    return (
      <div className="card text-center">
        <FormStatus state={state} />
        <p className="mt-6 font-display text-display-md">Thank you</p>
        <p className="mt-3 text-sm leading-relaxed text-brand-ink/70">
          If anything changes, just message Erick rather than filling the form in again.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="relative space-y-7">
      <Honeypot />

      <FormStatus state={state} />

      {/* --- Attending --- */}
      <fieldset>
        <legend className="field-label">Will you be there?</legend>
        <div className="mt-1 grid grid-cols-2 gap-3">
          {(
            [
              { value: "yes", label: "Yes, with joy" },
              { value: "no", label: "Sadly, no" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className={
                attending === option.value
                  ? "flex min-h-[52px] cursor-pointer items-center justify-center rounded-xl border border-brand-violet-500 bg-brand-violet-600/15 px-4 text-center text-sm font-medium text-brand-ink transition-colors duration-200"
                  : "flex min-h-[52px] cursor-pointer items-center justify-center rounded-xl border border-brand-line bg-brand-paper-100 px-4 text-center text-sm text-brand-ink/70 transition-colors duration-200 hover:border-brand-line-strong"
              }
            >
              <input
                type="radio"
                name="attending"
                value={option.value}
                checked={attending === option.value}
                onChange={() => setAttending(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
        <FieldError id={field("attending-error")} messages={errors?.attending} />
      </fieldset>

      {/* --- Name --- */}
      <div>
        <Label htmlFor={field("name")} required>
          Your full name
        </Label>
        <Input
          id={field("name")}
          name="name"
          autoComplete="name"
          required
          maxLength={120}
          aria-describedby={errors?.name ? field("name-error") : undefined}
          aria-invalid={errors?.name ? true : undefined}
          placeholder="Juan dela Cruz"
        />
        <FieldError id={field("name-error")} messages={errors?.name} />
      </div>

      {/* --- Contact --- */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor={field("email")}>Email</Label>
          <Input
            id={field("email")}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={160}
            aria-describedby={errors?.email ? field("email-error") : field("email-hint")}
            aria-invalid={errors?.email ? true : undefined}
            placeholder="you@example.com"
          />
          <Hint id={field("email-hint")}>Optional. Only used if a detail changes.</Hint>
          <FieldError id={field("email-error")} messages={errors?.email} />
        </div>

        <div>
          <Label htmlFor={field("phone")}>Mobile number</Label>
          <Input
            id={field("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={24}
            aria-describedby={errors?.phone ? field("phone-error") : field("phone-hint")}
            aria-invalid={errors?.phone ? true : undefined}
            placeholder="09XX XXX XXXX"
          />
          <Hint id={field("phone-hint")}>Optional, but the fastest way to reach you.</Hint>
          <FieldError id={field("phone-error")} messages={errors?.phone} />
        </div>
      </div>

      {/* --- Party, only when attending --- */}
      {attending === "yes" ? (
        <>
          <div>
            <Label htmlFor={field("partySize")} required>
              How many of you are coming, including yourself?
            </Label>
            <Select
              id={field("partySize")}
              name="partySize"
              defaultValue="1"
              aria-describedby={field("party-hint")}
            >
              {Array.from({ length: RSVP.maxPartySize }, (_, index) => index + 1).map((count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? "person" : "people"}
                </option>
              ))}
            </Select>
            <Hint id={field("party-hint")}>
              Please count only the people named on your invitation. The list is capped at 100.
            </Hint>
            <FieldError id={field("partySize-error")} messages={errors?.partySize} />
          </div>

          <div>
            <Label htmlFor={field("guestNames")}>Who is coming with you?</Label>
            <Textarea
              id={field("guestNames")}
              name="guestNames"
              rows={3}
              maxLength={600}
              aria-describedby={field("guests-hint")}
              placeholder={"One name per line"}
            />
            <Hint id={field("guests-hint")}>
              One name per line. These become the place cards, so spelling matters.
            </Hint>
            <FieldError id={field("guestNames-error")} messages={errors?.guestNames} />
          </div>

          <div>
            <Label htmlFor={field("dietary")}>Anything you cannot eat?</Label>
            <Textarea
              id={field("dietary")}
              name="dietary"
              rows={2}
              maxLength={400}
              aria-describedby={field("dietary-hint")}
              placeholder="Allergies, or anything the kitchen should know"
            />
            <Hint id={field("dietary-hint")}>
              Allergies especially. This goes straight to the caterer.
            </Hint>
            <FieldError id={field("dietary-error")} messages={errors?.dietary} />
          </div>

          <div>
            <Label htmlFor={field("songRequest")}>A song that will get you dancing</Label>
            <Input
              id={field("songRequest")}
              name="songRequest"
              maxLength={200}
              placeholder="Artist, title"
            />
            <Hint>No promises, but the playlist has to come from somewhere.</Hint>
            <FieldError id={field("songRequest-error")} messages={errors?.songRequest} />
          </div>
        </>
      ) : null}

      <div>
        <Label htmlFor={field("message")}>A note for Carlo and Kristinne</Label>
        <Textarea
          id={field("message")}
          name="message"
          rows={4}
          maxLength={1200}
          placeholder="Optional, and read by both of them"
        />
        <FieldError id={field("message-error")} messages={errors?.message} />
      </div>

      <div className="flex flex-col gap-4 border-t border-brand-line pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-brand-ink/60">
          Kindly reply by {RSVP.deadlineLabel}.
        </p>
        <SubmitButton attending={attending} />
      </div>
    </form>
  );
}
