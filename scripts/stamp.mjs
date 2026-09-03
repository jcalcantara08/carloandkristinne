#!/usr/bin/env node
/**
 * Machine stamp.
 *
 * Writes a tiny marker into a generated folder recording WHICH machine and
 * WHICH OS produced it. `npm run doctor` reads these stamps and refuses to
 * let you build on top of artifacts that were generated somewhere else.
 *
 * Why this exists: this project lives inside OneDrive, so node_modules/ and
 * .next/ sync between laptops. A cache built on macOS poisons a Windows
 * build (and the reverse) with errors that look like permission problems and
 * waste days. The stamp turns that silent failure into a one-line message.
 *
 * Usage:  node scripts/stamp.mjs <folder>
 * Never fails the build. A missing stamp is simply treated as "unknown".
 */

import { writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import os from "node:os";

export const STAMP_FILE = ".machine-stamp.json";

const target = process.argv[2];

if (!target) {
  console.error("stamp: no folder given. Usage: node scripts/stamp.mjs <folder>");
  process.exit(0);
}

const dir = resolve(process.cwd(), target);

if (!existsSync(dir)) {
  // Nothing was generated (for example a failed build). Not an error.
  process.exit(0);
}

const stamp = {
  platform: process.platform,
  arch: process.arch,
  node: process.version,
  hostname: os.hostname(),
  writtenAt: new Date().toISOString(),
};

try {
  writeFileSync(join(dir, STAMP_FILE), JSON.stringify(stamp, null, 2) + "\n", "utf8");
} catch {
  // A read-only or locked folder is not worth failing an install or build over.
}
