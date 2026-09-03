#!/usr/bin/env node
// clean.mjs - deletes machine-specific build caches.
//
// Why this exists: these folders live inside OneDrive, so they sync between
// laptops. A cache built on a Mac poisons the next Windows machine and produces
// build errors quoting paths from an operating system you are not even on.
// They are gitignored and regenerate. Deleting them is always safe.
//
// Cross-platform on purpose: no rm -rf, no PowerShell, just Node.
//   npm run clean          removes build caches
//   npm run clean -- --deep  also removes node_modules

import { rmSync, existsSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

const CACHES = [
  ".next",
  "dist",
  "build",
  "out",
  ".turbo",
  ".vite",
  ".swc",
  "coverage",
  "tsconfig.tsbuildinfo",
];

const DEEP = process.argv.includes("--deep");

function sizeOf(path) {
  let total = 0;
  const stack = [path];
  while (stack.length) {
    const p = stack.pop();
    const st = statSync(p, { throwIfNoEntry: false });
    if (!st) continue;
    if (st.isDirectory()) {
      try {
        for (const entry of readdirSync(p)) stack.push(join(p, entry));
      } catch {
        // unreadable directory, skip it
      }
    } else {
      total += st.size;
    }
  }
  return total;
}

function human(bytes) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${Math.round(bytes / 1024 ** 2)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

const targets = DEEP ? [...CACHES, "node_modules"] : CACHES;

let freed = 0;
let removed = 0;
let failed = 0;

for (const name of targets) {
  const path = join(ROOT, name);
  if (!existsSync(path)) continue;

  const bytes = sizeOf(path);
  try {
    rmSync(path, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
    freed += bytes;
    removed++;
    console.log(`  removed ${name}  (${human(bytes)})`);
  } catch (err) {
    failed++;
    // Most common cause on Windows: OneDrive or a running dev server holds a handle.
    console.log(`  COULD NOT REMOVE ${name}: ${err.message}`);
    console.log("    -> stop any running dev server, pause OneDrive sync, run again.");
  }
}

if (removed === 0 && failed === 0) {
  console.log("clean: nothing to remove, already clean.");
} else {
  console.log(`clean: freed ${human(freed)}.`);
  if (DEEP) console.log("clean: node_modules removed. Run `npm install` next.");
}

process.exit(failed > 0 ? 1 : 0);
