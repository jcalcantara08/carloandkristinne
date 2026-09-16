"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/admin-guard";
import { getContent, saveContent } from "@/lib/content";
import {
  CONTENT_SECTIONS,
  sectionById,
  setPath,
  type ListField,
  type SiteContent,
} from "@/lib/content-schema";
import { GALLERY } from "@/lib/constants";
import { normalizeMultiline, normalizeText, safeExtension } from "@/lib/sanitize";
import { uploadSiteAsset, writeAudit } from "@/lib/store";

/**
 * Saves one section of the public site's words and photographs.
 *
 * The form posts every field of the section. Text is trimmed and stripped
 * of tags; lists are rebuilt from their numbered rows, dropping any row
 * whose required field is blank (that is how a row is removed). An image
 * field takes an uploaded file first, then the "clear" box, then the URL as
 * typed. The result is merged into the whole document and saved as one.
 */

const TEXT_MAX = 600;
const AREA_MAX = 6000;
const LIST_MAX = 60;

function readText(formData: FormData, name: string, multiline: boolean): string | null {
  const raw = formData.get(name);
  if (typeof raw !== "string") return null;
  return multiline ? normalizeMultiline(raw).slice(0, AREA_MAX) : normalizeText(raw).slice(0, TEXT_MAX);
}

function readUrl(formData: FormData, name: string): string | null {
  const value = readText(formData, name, false);
  if (value === null) return null;
  if (!value) return "";
  // Only http(s) links ever reach a page. Anything else is dropped, not guessed.
  return /^https?:\/\//i.test(value) ? value : "";
}

function readList(formData: FormData, field: ListField): Record<string, string>[] {
  const count = Math.min(LIST_MAX, Number(formData.get(`${field.path}.count`)) || 0);
  const items: Record<string, string>[] = [];
  for (let index = 0; index < count; index += 1) {
    const item: Record<string, string> = {};
    for (const sub of field.itemFields) {
      const name = `${field.path}.${index}.${sub.key}`;
      let value: string | null;
      if (sub.type === "url") value = readUrl(formData, name);
      else if (sub.type === "select") {
        const raw = readText(formData, name, false) ?? "";
        value = sub.options?.includes(raw) ? raw : (sub.options?.[0] ?? "");
      } else value = readText(formData, name, sub.type === "textarea");
      item[sub.key] = value ?? "";
    }
    if (item[field.required]) items.push(item);
  }
  return items;
}

async function readImage(
  formData: FormData,
  path: string,
): Promise<{ value: string } | { error: string }> {
  if (formData.get(`${path}.clear`) === "on") return { value: "" };

  const file = formData.get(`${path}.file`);
  if (file instanceof File && file.size > 0) {
    if (!(GALLERY.acceptedTypes as readonly string[]).includes(file.type)) {
      return { error: "That file is not a photograph we can use. JPEG, PNG, WebP or HEIC, please." };
    }
    if (file.size > GALLERY.maxUploadBytes) {
      return { error: "That photograph is over the 12 MB limit." };
    }
    const result = await uploadSiteAsset({ file, extension: safeExtension(file.name) });
    if (!result.ok) return { error: "The photograph could not be saved. Please try again." };
    return { value: result.url };
  }

  return { value: readUrl(formData, path) ?? "" };
}

export async function updateContent(formData: FormData): Promise<void> {
  await requireAuth();

  const section = sectionById(String(formData.get("section") ?? ""));
  if (!section) return;

  const content = JSON.parse(JSON.stringify(await getContent())) as SiteContent;
  const doc = content as unknown as Record<string, unknown>;

  for (const field of section.fields) {
    if (field.type === "list") {
      setPath(doc, field.path, readList(formData, field));
      continue;
    }
    if (field.type === "image") {
      const image = await readImage(formData, field.path);
      if ("error" in image) redirect(`/admin/pages?section=${section.id}&error=${encodeURIComponent(image.error)}`);
      setPath(doc, field.path, image.value);
      continue;
    }
    const value =
      field.type === "url" ? readUrl(formData, field.path) : readText(formData, field.path, field.type === "textarea");
    if (value === null) continue;
    setPath(doc, field.path, value);
  }

  const saved = await saveContent(content);
  if (!saved.ok) {
    redirect(`/admin/pages?section=${section.id}&error=${encodeURIComponent("The database is not connected, so nothing was saved.")}`);
  }

  await writeAudit("content.save", section.label);

  // Every public page reads the same document, so refresh them all.
  for (const s of CONTENT_SECTIONS) revalidatePath(s.preview);
  revalidatePath("/admin/pages");

  redirect(`/admin/pages?section=${section.id}&saved=1`);
}

