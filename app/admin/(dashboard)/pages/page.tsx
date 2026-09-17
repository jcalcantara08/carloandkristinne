import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { requireAuth } from "@/lib/admin-guard";
import { Card } from "@/components/ui/Card";
import { Hint, Input, Label, Select, Textarea } from "@/components/ui/Field";
import { getContent } from "@/lib/content";
import {
  CONTENT_SECTIONS,
  getPath,
  sectionById,
  type ContentField,
  type ListField,
  type ScalarField,
} from "@/lib/content-schema";
import { GALLERY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { updateContent } from "@/app/admin/(dashboard)/pages/actions";

/**
 * Edit the website. One section per public page; every headline, paragraph,
 * list and photograph on that page in one form. Save publishes at once, and
 * the page link at the top opens the live result.
 */

function ScalarInput({ field, value }: { field: ScalarField; value: string }) {
  const id = field.path.replace(/\./g, "-");
  if (field.type === "image") {
    return (
      <div className="space-y-3">
        <Label htmlFor={`${id}-file`}>{field.label}</Label>
        {value ? (
          <div className="relative aspect-[3/2] max-w-sm overflow-hidden rounded-xl border border-brand-line bg-brand-paper-200">
            <Image src={value} alt="" fill sizes="384px" className="object-cover" />
          </div>
        ) : (
          <p className="text-sm text-brand-ink/60">No photograph set.</p>
        )}
        <Input id={`${id}-file`} type="file" name={`${field.path}.file`} accept={GALLERY.acceptAttribute} />
        <input type="hidden" name={field.path} value={value} />
        {value ? (
          <label className="flex items-center gap-2 text-sm text-brand-ink/70">
            <input type="checkbox" name={`${field.path}.clear`} className="h-4 w-4 rounded border-brand-line" />
            Remove the photograph
          </label>
        ) : null}
        {field.help ? <Hint>{field.help}</Hint> : null}
      </div>
    );
  }
  return (
    <div>
      <Label htmlFor={id}>{field.label}</Label>
      {field.type === "textarea" ? (
        <Textarea id={id} name={field.path} defaultValue={value} rows={4} className="mt-1.5" />
      ) : (
        <Input
          id={id}
          name={field.path}
          type={field.type === "url" ? "url" : "text"}
          defaultValue={value}
          className="mt-1.5"
        />
      )}
      {field.help ? <Hint className="mt-1.5">{field.help}</Hint> : null}
    </div>
  );
}

function ListInput({ field, items }: { field: ListField; items: Record<string, string>[] }) {
  const spare = field.spare ?? 1;
  const rows = [...items, ...Array.from({ length: spare }, () => ({}) as Record<string, string>)];
  return (
    <fieldset className="space-y-4">
      <legend className="field-label">{field.label}</legend>
      {field.help ? <Hint>{field.help}</Hint> : null}
      <input type="hidden" name={`${field.path}.count`} value={rows.length} />
      <ol className="space-y-3">
        {rows.map((row, index) => {
          const blank = index >= items.length;
          return (
            <li
              key={index}
              className={cn(
                "rounded-xl border p-4",
                blank ? "border-dashed border-brand-line-strong bg-brand-paper-200/60" : "border-brand-line bg-brand-paper-200",
              )}
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-eyebrow text-brand-ink/60">
                {blank ? "New" : index + 1}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {field.itemFields.map((sub) => {
                  const name = `${field.path}.${index}.${sub.key}`;
                  const id = name.replace(/\./g, "-");
                  const value = row[sub.key] ?? "";
                  const wide = sub.type === "textarea";
                  return (
                    <div key={sub.key} className={wide ? "sm:col-span-2" : undefined}>
                      <Label htmlFor={id} className="text-xs">
                        {sub.label}
                      </Label>
                      {sub.type === "textarea" ? (
                        <Textarea id={id} name={name} defaultValue={value} rows={3} className="mt-1 min-h-[5rem]" />
                      ) : sub.type === "select" ? (
                        <Select id={id} name={name} defaultValue={value || sub.options?.[0]} className="mt-1">
                          {(sub.options ?? []).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <Input
                          id={id}
                          name={name}
                          type={sub.type === "url" ? "url" : "text"}
                          defaultValue={value}
                          className="mt-1"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>
    </fieldset>
  );
}

function FieldFor({ field, content }: { field: ContentField; content: unknown }) {
  const value = getPath(content, field.path);
  if (field.type === "list") {
    return <ListInput field={field} items={Array.isArray(value) ? (value as Record<string, string>[]) : []} />;
  }
  return <ScalarInput field={field} value={typeof value === "string" ? value : ""} />;
}

export default async function EditPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; saved?: string; error?: string }>;
}) {
  await requireAuth();

  const params = await searchParams;
  const section = sectionById(params.section ?? "") ?? CONTENT_SECTIONS[0];
  const content = await getContent();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-display-md">Edit the website</h2>
        <p className="mt-2 text-sm text-brand-ink/70">
          Change the words and photographs on every public page. Save publishes straight away.
          Leave a field empty and that line is simply not shown; nothing is invented in its place.
        </p>
      </div>

      <nav aria-label="Pages" className="flex flex-wrap gap-2">
        {CONTENT_SECTIONS.map((s) => (
          <Link
            key={s.id}
            href={`/admin/pages?section=${s.id}`}
            aria-current={s.id === section.id ? "page" : undefined}
            className={cn(
              "inline-flex min-h-[36px] items-center rounded-full border px-4 text-xs font-medium transition-colors duration-200",
              s.id === section.id
                ? "border-brand-plum-600 bg-brand-plum-100 text-brand-plum-600"
                : "border-brand-line text-brand-ink/70 hover:border-brand-plum-600/50 hover:text-brand-ink",
            )}
          >
            {s.label}
          </Link>
        ))}
      </nav>

      {params.saved ? (
        <p role="status" className="rounded-xl border border-brand-plum-600/40 bg-brand-plum-600/10 px-4 py-3 text-sm text-brand-plum-600">
          Saved. The public site shows your changes now.{" "}
          <Link href={section.preview} target="_blank" className="underline underline-offset-4">
            Open the page
          </Link>
        </p>
      ) : null}
      {params.error ? (
        <p role="alert" className="rounded-xl border border-brand-line-strong bg-brand-paper-200 px-4 py-3 text-sm text-brand-ink">
          {params.error}
        </p>
      ) : null}

      <form action={updateContent} encType="multipart/form-data">
        <input type="hidden" name="section" value={section.id} />
        <Card className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-display-md">{section.label}</h3>
              <p className="mt-2 text-sm text-brand-ink/70">{section.description}</p>
            </div>
            <Link
              href={section.preview}
              target="_blank"
              className="inline-flex min-h-[36px] items-center gap-1.5 text-xs font-medium text-brand-ink/70 underline underline-offset-4 hover:text-brand-ink"
            >
              Open the live page
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {section.fields.map((field) => (
            <FieldFor key={field.path} field={field} content={content} />
          ))}

          <div className="flex flex-wrap items-center gap-3 border-t border-brand-line pt-5">
            <button type="submit" className="btn-primary px-6 py-2.5 text-xs">
              Save and publish
            </button>
            <span className="text-xs text-brand-ink/60">Changes go live the moment you save.</span>
          </div>
        </Card>
      </form>
    </div>
  );
}
