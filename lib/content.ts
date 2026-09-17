import "server-only";

import { cache } from "react";
import { readSiteDoc, writeSiteDoc } from "@/lib/store";
import { DEFAULT_CONTENT, healContent, mergeContent, type SiteContent } from "@/lib/content-schema";

export const CONTENT_KEY = "content";

/**
 * The words on the public pages: the saved document merged over the
 * defaults in code. Cached per request, so every section on a page reads
 * the same document once.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  const stored = await readSiteDoc<Partial<SiteContent>>(CONTENT_KEY, {});
  return healContent(mergeContent(DEFAULT_CONTENT, stored));
});

export const saveContent = (data: SiteContent) => writeSiteDoc(CONTENT_KEY, data);
