/**
 * The site document versus the defaults in code.
 *
 * A dashboard save used to snapshot the whole document, so every default that
 * existed at that moment was frozen in the database, and a fact changed in
 * code later (the printed card, the couple's programme sheet, a new reply-by
 * date) never reached the live site. Two rules end that.
 *
 * 1. A save stores only what differs from the defaults (`sparse`). A field
 *    the couple never touched is not in the database at all, so the code's
 *    current default always shows.
 * 2. A stored value that equals a default from an earlier version of the code
 *    is a leftover snapshot, not an edit, and is dropped on read
 *    (`dropRetired`). The list of those earlier defaults is generated from
 *    git history by `npm run retired` into `lib/retired-defaults.json`.
 *
 * Arrays are compared whole: a list is either the couple's or the code's.
 * Values are hashed with their path, so a short string that is an old default
 * in one field is never mistaken for an edit in another.
 */

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const isObject = (v: unknown): v is Record<string, Json> => !!v && typeof v === "object" && !Array.isArray(v);

/**
 * JSON with object keys sorted, so the same data always hashes the same. An
 * object key that is missing, undefined or an empty string is left out: the
 * editor rebuilds a list row with "" for every field it has no value for,
 * and a row the code shipped without that field is the same row.
 */
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (isObject(value)) {
    return `{${Object.keys(value)
      .sort()
      .filter((k) => value[k] !== undefined && value[k] !== "")
      .map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value ?? null);
}

/** FNV-1a over the path and the canonical value, twice (two seeds), as 16 hex chars. */
export function fingerprint(path: string, value: unknown): string {
  const text = `${path}\u0000${canonical(value)}`;
  const fnv = (seed: number) => {
    let h = seed >>> 0;
    for (let i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h.toString(16).padStart(8, "0");
  };
  return fnv(2166136261) + fnv(0x811c9dc5 ^ 0x5bd1e995);
}

/** Calls `visit` for every scalar and every array in `value`, with its dotted path. */
export function walkLeaves(value: unknown, visit: (path: string, leaf: unknown) => void, path = ""): void {
  if (isObject(value)) {
    for (const key of Object.keys(value)) walkLeaves(value[key], visit, path ? `${path}.${key}` : key);
    return;
  }
  visit(path, value);
}

/** Only the parts of `doc` that differ from `defaults`. Unchanged fields are left out entirely. */
export function sparse<T>(defaults: T, doc: T): Partial<T> {
  if (Array.isArray(defaults) || Array.isArray(doc)) {
    return (canonical(defaults) === canonical(doc) ? undefined : doc) as Partial<T>;
  }
  if (isObject(defaults) && isObject(doc)) {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(doc)) {
      const kept = sparse((defaults as Record<string, unknown>)[key], doc[key]);
      if (kept !== undefined) out[key] = kept;
    }
    return (Object.keys(out).length ? out : undefined) as Partial<T>;
  }
  return (doc === defaults ? undefined : doc) as Partial<T>;
}

/**
 * Removes from `stored` every scalar and array whose fingerprint is in
 * `retired`: a value the code used to ship as a default and no longer does.
 * Returns the count removed, for the log.
 */
export function dropRetired(stored: unknown, retired: ReadonlySet<string>, path = ""): number {
  if (!isObject(stored)) return 0;
  let dropped = 0;
  for (const key of Object.keys(stored)) {
    const child = stored[key];
    const childPath = path ? `${path}.${key}` : key;
    if (isObject(child)) {
      dropped += dropRetired(child, retired, childPath);
      if (Object.keys(child).length === 0) delete stored[key];
      continue;
    }
    if (retired.has(fingerprint(childPath, child))) {
      delete stored[key];
      dropped += 1;
    }
  }
  return dropped;
}
