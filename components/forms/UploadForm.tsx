"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImagePlus, Loader2 } from "lucide-react";

import { submitPhotos } from "@/app/actions/gallery";
import { FieldError, Hint, Input, Label } from "@/components/ui/Field";
import { FormStatus, Honeypot } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";
import { GALLERY } from "@/lib/constants";
import { formatBytes } from "@/lib/utils";
import { IDLE, type ActionState } from "@/lib/types";

function SubmitButton({ count }: { count: number }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || count === 0} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Uploading
        </>
      ) : count === 0 ? (
        "Choose photographs first"
      ) : (
        `Upload ${count} ${count === 1 ? "photograph" : "photographs"}`
      )}
    </Button>
  );
}

export function UploadForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(submitPhotos, IDLE);
  const [selected, setSelected] = useState<string[]>([]);
  const ids = useId();
  const errors = state.status === "error" ? state.fieldErrors : undefined;
  const field = (name: string) => `${ids}-${name}`;

  return (
    <form
      action={formAction}
      className="relative space-y-6"
      onSubmit={() => setSelected([])}
    >
      <Honeypot />
      <FormStatus state={state} />

      <div>
        <Label htmlFor={field("photos")} required>
          Your photographs
        </Label>

        <label
          htmlFor={field("photos")}
          className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-brand-line-strong bg-brand-paper-100 px-6 py-10 text-center transition-colors duration-200 hover:border-brand-steel-500"
        >
          <ImagePlus className="h-7 w-7 text-brand-steel-500" aria-hidden="true" />
          <span className="mt-3 text-sm font-medium text-brand-ink">
            Tap to choose from your phone
          </span>
          <span className="mt-1 text-xs text-brand-ink/60">
            Up to {GALLERY.maxFilesPerUpload} at a time, {formatBytes(GALLERY.maxUploadBytes)} each
          </span>
        </label>

        <input
          id={field("photos")}
          name="photos"
          type="file"
          multiple
          accept={GALLERY.acceptAttribute}
          required
          className="sr-only"
          onChange={(event) =>
            setSelected(Array.from(event.target.files ?? []).map((file) => file.name))
          }
          aria-describedby={field("photos-hint")}
        />

        <Hint id={field("photos-hint")}>
          JPEG, PNG, WebP or HEIC. Originals are kept, so anyone can download them at full size.
        </Hint>

        {selected.length > 0 ? (
          <ul className="mt-3 space-y-1 text-xs text-brand-ink/65">
            {selected.slice(0, 10).map((name) => (
              <li key={name} className="truncate">
                {name}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor={field("uploaderName")}>Your name</Label>
          <Input
            id={field("uploaderName")}
            name="uploaderName"
            autoComplete="name"
            maxLength={80}
            placeholder="Optional, but nice to credit"
          />
          <FieldError id={field("uploaderName-error")} messages={errors?.uploaderName} />
        </div>

        <div>
          <Label htmlFor={field("caption")}>Caption</Label>
          <Input
            id={field("caption")}
            name="caption"
            maxLength={240}
            placeholder="What is happening here?"
          />
          <FieldError id={field("caption-error")} messages={errors?.caption} />
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-brand-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-brand-ink/60">
          Everything is checked by the couple before it appears in the album.
        </p>
        <SubmitButton count={selected.length} />
      </div>
    </form>
  );
}
