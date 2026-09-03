import { readFileSync } from "node:fs";
import { join } from "node:path";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

/**
 * Compile the stylesheet and fail loudly if it does not build.
 *
 * This exists because of a real miss. A `@apply border-white/12` slipped
 * through `typecheck`, `lint`, `qa`, `grammar` and `security` untouched,
 * because none of those five compile CSS. 12 is not a step on Tailwind's
 * default opacity scale, so every route 500'd the moment the dev server
 * tried to render, and nothing before `next build` said a word.
 *
 * Any invalid utility inside an @apply is a build-breaking error, so it
 * belongs in the cheap check that runs before the expensive one.
 */
const ROOT = process.cwd();
const CSS_PATH = join(ROOT, "styles", "globals.css");

async function main() {
  const css = readFileSync(CSS_PATH, "utf8");

  try {
    const result = await postcss([tailwindcss, autoprefixer]).process(css, {
      from: CSS_PATH,
      to: undefined,
    });

    // Touching the output forces the lazy pipeline to finish.
    const bytes = result.css.length;
    if (bytes < 1000) {
      console.error("[css] compiled to only " + bytes + " bytes. That is almost certainly wrong.");
      process.exit(1);
    }

    console.log(`[css] clean. globals.css compiles to ${Math.round(bytes / 1024)} KB.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[css] globals.css does not compile:");
    console.error(`  ${message}`);
    process.exit(1);
  }
}

void main();
