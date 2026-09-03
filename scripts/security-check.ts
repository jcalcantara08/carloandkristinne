import { readFileSync, existsSync } from "node:fs";
import { relative, join } from "node:path";
import { walk, report, type Issue } from "./lib/walk";

/**
 * A static scan for the mistakes that have actually happened in this folder
 * before: a fallback admin password, a committed secret, an unguarded
 * mutation, and dangerouslySetInnerHTML somewhere it does not belong.
 */

const ROOT = process.cwd();
const issues: Issue[] = [];

const sourceFiles = walk(join(ROOT, "app"), [".ts", ".tsx"]).concat(
  walk(join(ROOT, "lib"), [".ts"]),
  walk(join(ROOT, "components"), [".ts", ".tsx"]),
);

/** Files where a JSON-LD injection is expected and safe. */
const JSON_LD_ALLOWED = /(layout|page)\.tsx$/;

for (const file of sourceFiles) {
  const relativePath = relative(ROOT, file);
  const contents = readFileSync(file, "utf8");
  const lines = contents.split("\n");

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // A fallback password or secret. The exact shape that bit Sourire and ECG.
    if (/process\.env\.(ADMIN_PASSWORD|ADMIN_SESSION_SECRET|[A-Z_]*SECRET[A-Z_]*)\s*(\|\||\?\?)/.test(line)) {
      issues.push({
        file: relativePath,
        line: lineNumber,
        message: "Secret with a fallback value. Fail closed instead: throw when it is missing.",
      });
    }

    // A hardcoded key.
    if (/(sk_live_|sk_test_|re_[A-Za-z0-9]{20,}|eyJ[A-Za-z0-9_-]{30,})/.test(line)) {
      issues.push({
        file: relativePath,
        line: lineNumber,
        message: "This looks like a hardcoded API key or JWT.",
      });
    }

    // dangerouslySetInnerHTML outside the JSON-LD blocks.
    if (/dangerouslySetInnerHTML/.test(line) && !JSON_LD_ALLOWED.test(relativePath)) {
      issues.push({
        file: relativePath,
        line: lineNumber,
        message: "dangerouslySetInnerHTML outside a page or layout JSON-LD block.",
      });
    }

    // The service role client must never be reachable from the browser.
    if (/from "@\/lib\/supabase\/admin"/.test(line) && /"use client"/.test(contents)) {
      issues.push({
        file: relativePath,
        line: lineNumber,
        message: "The service role client is imported into a client component.",
      });
    }
  });

  // Every admin server action must call requireAuth.
  //
  // app/admin/login/actions.ts is the one exemption, and it has to be: it is
  // how a session is created in the first place. It is protected instead by
  // IP rate limiting and a constant-time password compare.
  const isSignInAction = relativePath.includes(join("admin", "login"));
  const isAdminAction =
    contents.includes('"use server"') &&
    relativePath.includes(join("admin")) &&
    !isSignInAction;

  if (isAdminAction && !contents.includes("requireAuth")) {
    issues.push({
      file: relativePath,
      line: 1,
      message: "An admin Server Action file does not call requireAuth().",
    });
  }
}

/* ---- No real secrets in the committed example ---- */

const envExample = join(ROOT, ".env.example");
if (existsSync(envExample)) {
  readFileSync(envExample, "utf8")
    .split("\n")
    .forEach((line, index) => {
      const match = /^([A-Z_]+)=(.+)$/.exec(line.trim());
      if (!match) return;
      const [, key, value] = match;
      // A documented default URL is fine. A populated secret is not.
      const isSecret = /PASSWORD|SECRET|KEY|TOKEN/.test(key);
      if (isSecret && value.length > 0) {
        issues.push({
          file: ".env.example",
          line: index + 1,
          message: `${key} has a value. Every secret in the example must be blank.`,
        });
      }
    });
}

/* ---- .env.local must not be tracked ---- */

if (existsSync(join(ROOT, ".env.local"))) {
  const gitignore = existsSync(join(ROOT, ".gitignore"))
    ? readFileSync(join(ROOT, ".gitignore"), "utf8")
    : "";
  if (!gitignore.includes(".env.local")) {
    issues.push({
      file: ".gitignore",
      line: 1,
      message: ".env.local exists but is not gitignored.",
    });
  }
}

report("security", issues, sourceFiles.length);
