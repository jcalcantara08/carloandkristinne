import { readFileSync, existsSync, statSync } from "node:fs";
import { relative, join } from "node:path";
import { walk, report, type Issue } from "./lib/walk";

/**
 * Broken internal links, missing alt text, missing metadata, oversized
 * images, and stray console.log in source. Runs before every build.
 */

const ROOT = process.cwd();
const APP = join(ROOT, "app");
const issues: Issue[] = [];

const sourceFiles = walk(join(ROOT, "app"), [".tsx", ".ts"]).concat(
  walk(join(ROOT, "components"), [".tsx", ".ts"]),
  walk(join(ROOT, "lib"), [".ts"]),
);

/* ---- 1. Internal links resolve to a real route ---- */

function routeExists(href: string): boolean {
  const clean = href.split(/[?#]/)[0];
  if (clean === "/") return existsSync(join(APP, "page.tsx"));

  const segments = clean.replace(/^\//, "").split("/");
  // Route groups are parenthesised directories, so check both shapes.
  const direct = join(APP, ...segments, "page.tsx");
  const routeHandler = join(APP, ...segments, "route.ts");
  if (existsSync(direct) || existsSync(routeHandler)) return true;

  // /admin/rsvps lives in app/admin/(dashboard)/rsvps.
  const [first, ...rest] = segments;
  const grouped = join(APP, first, "(dashboard)", ...rest, "page.tsx");
  const groupedRoute = join(APP, first, "(dashboard)", ...rest, "route.ts");
  if (existsSync(grouped) || existsSync(groupedRoute)) return true;

  // /admin itself is app/admin/(dashboard)/page.tsx.
  return existsSync(join(APP, first, "(dashboard)", "page.tsx")) && rest.length === 0;
}

for (const file of sourceFiles) {
  const relativePath = relative(ROOT, file);
  const contents = readFileSync(file, "utf8");
  const lines = contents.split("\n");

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // href="/something" on a Link or an anchor.
    const hrefMatch = /href="(\/[^"]*)"/.exec(line);
    if (hrefMatch) {
      const href = hrefMatch[1];
      // Files under public/ and the generated metadata routes are fine.
      const isAsset = /\.(png|jpg|jpeg|svg|webp|ico|xml|txt|webmanifest|csv)$/.test(href);
      if (!isAsset && !routeExists(href)) {
        issues.push({
          file: relativePath,
          line: lineNumber,
          message: `Internal link "${href}" does not resolve to a page.`,
        });
      }
    }

    // console.log in shipped source. console.error and console.info are
    // deliberate in the store and the email wrapper.
    if (/\bconsole\.log\(/.test(line) && !relativePath.startsWith("scripts")) {
      issues.push({
        file: relativePath,
        line: lineNumber,
        message: "console.log in source. Remove it or use console.error.",
      });
    }
  });

  /* ---- 2. Images have alt text ---- */
  // next/image and PhotoFrame both require alt. Flag a missing one.
  const imageTags = contents.match(/<(Image|PhotoFrame)\b[^>]*>/gs) ?? [];
  for (const tag of imageTags) {
    if (!/\balt=/.test(tag)) {
      issues.push({
        file: relativePath,
        line: 1,
        message: "An Image or PhotoFrame is missing an alt attribute.",
      });
    }
  }

  /* ---- 3. Every public page exports metadata ---- */
  const isPage = relativePath.endsWith(`page.tsx`);
  const isAdmin = relativePath.includes(`admin`);
  const isRoot = relativePath === join("app", "page.tsx");
  if (isPage && !isAdmin && !isRoot && !/export const metadata/.test(contents)) {
    issues.push({
      file: relativePath,
      line: 1,
      message: "Public page has no metadata export. Build one with pageMeta().",
    });
  }
}

/* ---- 4. Images in public/ are under 300 KB ---- */

const publicDir = join(ROOT, "public");
if (existsSync(publicDir)) {
  const images = walk(publicDir, [".png", ".jpg", ".jpeg", ".webp"]);
  for (const image of images) {
    const size = statSync(image).size;
    if (size > 300 * 1024) {
      issues.push({
        file: relative(ROOT, image),
        line: 1,
        message: `${Math.round(size / 1024)} KB, over the 300 KB budget.`,
      });
    }
  }
}

/* ---- 5. The documentation the rules require actually exists ---- */

// The two manuals live in docs/. The root USER_MANUAL.md and handoff.md are
// short pointers kept so PROJECT_RULES.md and older references still resolve.
for (const doc of [
  "README.md",
  "PROJECT_RULES.md",
  "USER_MANUAL.md",
  "handoff.md",
  "docs/USER-MANUAL.md",
  "docs/DEVELOPER-HANDOFF.md",
]) {
  if (!existsSync(join(ROOT, doc))) {
    issues.push({ file: doc, line: 1, message: "Required document is missing." });
  }
}

report("qa", issues, sourceFiles.length);
