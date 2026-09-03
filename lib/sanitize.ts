/**
 * Server-side sanitisation. Client validation is UX. This is the security half.
 * Everything a guest types passes through here before it is stored or emailed.
 */

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] ?? char);
}

export function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Drop C0 and C1 control characters. Written as a code-point filter rather
 * than a regex character class so the literal control bytes never have to
 * appear in this file.
 */
function stripControlChars(input: string, keepNewlines = false): string {
  let out = "";
  for (const char of input) {
    const code = char.codePointAt(0) ?? 0;
    if (keepNewlines && char === "\n") {
      out += char;
      continue;
    }
    if (code < 0x20 || (code >= 0x7f && code <= 0x9f)) {
      out += " ";
      continue;
    }
    out += char;
  }
  return out;
}

/** Collapse whitespace, strip control characters, trim. Single-line fields. */
export function normalizeText(input: string): string {
  return stripControlChars(stripTags(input))
    .replace(/\s+/g, " ")
    .trim();
}

/** Same as normalizeText but keeps paragraph breaks, for message fields. */
export function normalizeMultiline(input: string): string {
  return stripControlChars(stripTags(input).replace(/\r\n?/g, "\n"), true)
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Philippine mobile numbers, loosely. Keeps digits and a single leading plus. */
export function normalizePhone(input: string): string {
  const cleaned = input.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? `+${cleaned.slice(1).replace(/\+/g, "")}` : cleaned.replace(/\+/g, "");
}

export function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

/**
 * The file extension for an object we are about to write to storage.
 * Never trust the client's filename; the caller supplies the random stem.
 */
export function safeExtension(filename: string, fallback = "jpg"): string {
  const match = /\.([a-zA-Z0-9]{2,5})$/.exec(filename);
  if (!match) return fallback;
  const ext = match[1].toLowerCase();
  return /^(jpe?g|png|webp|heic|heif)$/.test(ext) ? ext : fallback;
}
