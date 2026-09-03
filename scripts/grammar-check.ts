import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { walk, report, type Issue } from "./lib/walk";

/**
 * Em dashes are banned by PROJECT_RULES.md section 3. Use commas, periods
 * or parentheses instead. This is the check that enforces it, plus a few
 * other things that quietly make copy look unfinished.
 */

const ROOT = process.cwd();
const EM_DASH = String.fromCharCode(0x2014);
const EN_DASH = String.fromCharCode(0x2013);

const MISSPELLINGS: [RegExp, string][] = [
  [/\bteh\b/gi, "teh"],
  [/\brecieve\b/gi, "recieve"],
  [/\boccured\b/gi, "occured"],
  [/\bseperate\b/gi, "seperate"],
  [/\bdefinately\b/gi, "definately"],
  [/\baccomodate\b/gi, "accomodate"],
  [/\bwich\b/g, "wich"],
];

const files = walk(ROOT, [".ts", ".tsx", ".md", ".css", ".sql"]).filter(
  // This file necessarily contains the characters and the misspellings it
  // looks for, so it cannot check itself.
  (file) => !file.endsWith("grammar-check.ts"),
);

const issues: Issue[] = [];

for (const file of files) {
  const relativePath = relative(ROOT, file);
  const lines = readFileSync(file, "utf8").split("\n");
  let inCodeFence = false;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Code inside a fence is not prose, and neither is an aligned table row.
    if (line.trimStart().startsWith("```")) {
      inCodeFence = !inCodeFence;
      return;
    }
    if (inCodeFence) return;

    const isTableRow = line.trimStart().startsWith("|");

    if (line.includes(EM_DASH)) {
      issues.push({
        file: relativePath,
        line: lineNumber,
        message: "Em dash found. Use a comma, a period or parentheses.",
      });
    }

    // An en dash is fine inside a numeric range, and wrong in prose.
    if (line.includes(EN_DASH) && !/\d\s*[–]\s*\d/.test(line)) {
      issues.push({
        file: relativePath,
        line: lineNumber,
        message: "En dash outside a numeric range.",
      });
    }

    // Double spaces in prose files only. Code indentation and table
    // alignment are not prose.
    if (relativePath.endsWith(".md") && !isTableRow && /\S {2,}\S/.test(line)) {
      issues.push({ file: relativePath, line: lineNumber, message: "Double space in prose." });
    }

    for (const [pattern, word] of MISSPELLINGS) {
      if (pattern.test(line)) {
        issues.push({ file: relativePath, line: lineNumber, message: `Likely misspelling: ${word}` });
      }
      pattern.lastIndex = 0;
    }
  });
}

report("grammar", issues, files.length);
