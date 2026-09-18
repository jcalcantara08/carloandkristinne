import "server-only";

import { cache } from "react";
import { readSiteDoc, writeSiteDoc } from "@/lib/store";
import { dropRetired, sparse } from "@/lib/content-diff";
import { DEFAULT_CONTENT, healContent, mergeContent, type SiteContent } from "@/lib/content-schema";
import retiredDefaults from "@/lib/retired-defaults.json";

export const CONTENT_KEY = "content";

/** Defaults from earlier commits, so a stored copy of one is not mistaken for an edit. */
const RETIRED = new Set<string>(retiredDefaults.fingerprints);

/**
 * The words on the public pages: the saved document merged over the
 * defaults in code. Cached per request, so every section on a page reads
 * the same document once. Before the merge, any stored value that is a
 * default from an earlier version of the code is dropped, so a save made
 * when the whole document was still snapshotted cannot pin an old fact.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  const stored = await readSiteDoc<Partial<SiteContent>>(CONTENT_KEY, {});
  dropRetired(stored, RETIRED);
  return healContent(mergeContent(DEFAULT_CONTENT, stored));
});

/** Stores only what differs from the defaults, so a later change in code always reaches the site. */
export const saveContent = (data: SiteContent) => writeSiteDoc(CONTENT_KEY, sparse(DEFAULT_CONTENT, data) ?? {});
