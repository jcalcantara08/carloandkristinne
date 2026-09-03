import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SKIP = new Set(["node_modules", ".next", ".git", ".vercel", "out", "coverage"]);

/** Every file under `root` whose extension is in `extensions`. */
export function walk(root: string, extensions: string[]): string[] {
  const found: string[] = [];

  const visit = (dir: string) => {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }

    for (const entry of entries) {
      if (SKIP.has(entry)) continue;
      const full = join(dir, entry);
      const stats = statSync(full);
      if (stats.isDirectory()) visit(full);
      else if (extensions.some((extension) => entry.endsWith(extension))) found.push(full);
    }
  };

  visit(root);
  return found;
}

export type Issue = { file: string; line: number; message: string };

export function report(name: string, issues: Issue[], scanned: number): void {
  if (issues.length === 0) {
    console.log(`[${name}] clean. ${scanned} files scanned.`);
    return;
  }

  console.error(`[${name}] ${issues.length} issue${issues.length === 1 ? "" : "s"}:`);
  for (const issue of issues) {
    console.error(`  ${issue.file}:${issue.line}  ${issue.message}`);
  }
  process.exit(1);
}
