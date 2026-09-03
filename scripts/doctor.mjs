#!/usr/bin/env node
// doctor.mjs - checks whether THIS laptop can actually run THIS project.
//
// Run it first on any new or reformatted machine, and any time something
// behaves strangely. It never changes anything; it only reports.
//
//   npm run doctor
//
// Exit 0 = good to go (warnings allowed). Exit 1 = something blocks you.
// Zero dependencies on purpose, so it works before `npm install`.

import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { platform } from "node:os";

const ROOT = process.cwd();
const OS = platform();

const blockers = [];
const warnings = [];
const ok = [];

const pass = (m) => ok.push(m);
const warn = (m, fix) => warnings.push({ m, fix });
const block = (m, fix) => blockers.push({ m, fix });

function run(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"], encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

// ── 1. Node ───────────────────────────────────────────────────────────
const nodeMajor = Number(process.versions.node.split(".")[0]);
const pkg = readJson(join(ROOT, "package.json"));
const required = pkg?.engines?.node ?? ">=20.9.0";
const requiredMajor = Number(String(required).match(/(\d+)/)?.[1] ?? 20);

if (nodeMajor >= requiredMajor) {
  pass(`Node ${process.versions.node} (needs ${required})`);
} else {
  block(
    `Node ${process.versions.node} is too old. This project needs ${required}.`,
    OS === "win32"
      ? "Install the LTS from https://nodejs.org, or: winget install OpenJS.NodeJS.LTS"
      : "Install with: brew install node   (or use nvm: nvm install)"
  );
}

if (existsSync(join(ROOT, ".nvmrc"))) {
  const pinned = readFileSync(join(ROOT, ".nvmrc"), "utf8").trim();
  if (Number(pinned.replace(/^v/, "").split(".")[0]) !== nodeMajor) {
    warn(
      `.nvmrc pins Node ${pinned} but you are running ${nodeMajor}.`,
      "Not fatal, but builds may differ from production. `nvm use` if you have nvm."
    );
  }
}

// ── 2. Required tooling ───────────────────────────────────────────────
const npmVersion = run("npm -v");
if (npmVersion) pass(`npm ${npmVersion}`);
else block("npm is not available.", "It ships with Node. Reinstall Node from https://nodejs.org");

const gitVersion = run("git --version");
if (gitVersion) {
  pass(gitVersion);
  const name = run("git config user.name");
  const email = run("git config user.email");
  if (!name || !email) {
    block(
      "Git has no identity set, so you cannot commit.",
      'git config --global user.name "Erick Jhon L. Cabal"\n     git config --global user.email "your@email.com"'
    );
  } else {
    pass(`git identity: ${name} <${email}>`);
  }
} else {
  block(
    "Git is not installed.",
    OS === "win32"
      ? "winget install Git.Git   (or https://git-scm.com/download/win)"
      : "brew install git   (or xcode-select --install)"
  );
}

// ── 3. Optional tooling ───────────────────────────────────────────────
const gh = run("gh --version");
if (gh) pass(`GitHub CLI ${gh.split("\n")[0].replace("gh version ", "")}`);
else
  warn(
    "GitHub CLI (gh) is not installed. Handy for auth and PRs, not required.",
    OS === "win32" ? "winget install GitHub.cli" : "brew install gh"
  );

const vercel = run("vercel --version");
if (vercel) pass(`Vercel CLI ${vercel}`);
else
  warn(
    "Vercel CLI is not installed. Only needed to pull env vars or deploy from the terminal.",
    "npm i -g vercel     then: vercel login"
  );

// ── 4. Dependencies installed ─────────────────────────────────────────
// A static site has no dependencies at all, so demanding node_modules would
// be a fake blocker. Only ask for it when package.json actually lists deps.
const depCount =
  Object.keys(pkg?.dependencies || {}).length + Object.keys(pkg?.devDependencies || {}).length;

// The stamp is written by scripts/stamp.mjs on every install and build. It
// records which OS produced a generated folder, so a cache that synced in from
// the other laptop is caught for certain instead of guessed at.
const STAMP_FILE = ".machine-stamp.json";
const stampOf = (rel) => readJson(join(ROOT, rel, STAMP_FILE));

// The origin check runs whenever node_modules EXISTS, even on a static project
// that declares no dependencies. A stray node_modules can still sync in from
// the other laptop, and it is just as poisonous there.
const hasNodeModules = existsSync(join(ROOT, "node_modules"));

if (hasNodeModules) {
  const stamp = stampOf("node_modules");
  if (stamp?.platform && stamp.platform !== OS) {
    block(
      `node_modules was installed on ${stamp.platform} (host "${stamp.hostname}") but you are on ${OS}. Native binaries will not run, and the errors this causes look like permission problems.`,
      "npm run clean -- --deep && npm install"
    );
  } else if (!stamp) {
    warn(
      "node_modules has no machine stamp, so it may have been installed on another laptop.",
      "npm install   (rewrites the stamp; safe to run any time)"
    );
  } else {
    pass(`node_modules installed on this machine (${stamp.platform}, Node ${stamp.node})`);
  }
}

if (depCount === 0) {
  pass("no dependencies to install (plain static project)");
} else if (!hasNodeModules) {
  block("Dependencies are not installed.", "npm install");
}

// ── 5. Build cache from another machine (the OneDrive trap) ───────────
// A cache built on a different OS syncs through OneDrive and breaks builds
// with errors quoting paths from an operating system you are not on.
function looksForeign() {
  const probes = [".next/trace", ".next/build-manifest.json", ".next/BUILD_ID"];
  for (const rel of probes) {
    const p = join(ROOT, rel);
    if (!existsSync(p)) continue;
    let text;
    try {
      text = readFileSync(p, "utf8").slice(0, 200_000);
    } catch {
      continue;
    }
    if (OS === "win32" && /\/Users\/[A-Za-z]/.test(text)) return "Mac/Linux";
    if (OS !== "win32" && /[A-Z]:\\\\?Users\\\\?/.test(text)) return "Windows";
  }
  return null;
}

if (existsSync(join(ROOT, ".next"))) {
  const stamp = stampOf(".next");
  const foreign = looksForeign();
  if (stamp?.platform && stamp.platform !== OS) {
    // Authoritative: the build told us where it came from.
    block(
      `.next was built on ${stamp.platform} (host "${stamp.hostname}") and synced here through OneDrive. Building on top of it fails with misleading path or permission errors.`,
      "npm run clean"
    );
  } else if (foreign) {
    // Fallback for caches built before stamping existed.
    block(
      `The .next build cache was built on ${foreign}, not on this machine. This is the OneDrive cache trap and it will break your build.`,
      "npm run clean"
    );
  } else if (stamp) {
    pass(`.next built on this machine (${stamp.platform})`);
  } else {
    warn(
      "A .next build cache exists with no machine stamp, so its origin is unknown.",
      "If anything builds strangely, run `npm run clean` before debugging anything else."
    );
  }
}

// ── 6. Environment variables ──────────────────────────────────────────
const examplePath = join(ROOT, ".env.example");
const localPath = join(ROOT, ".env.local");

// A static site reads no env vars, so its .env.example says so and there is
// nothing for a new laptop to refill. Do not nag about a missing .env.local.
const staticNoEnv =
  existsSync(examplePath) &&
  !readFileSync(examplePath, "utf8")
    .split("\n")
    .some((l) => l.trim() && !l.trim().startsWith("#"));

if (!existsSync(examplePath)) {
  warn(
    ".env.example is missing, so a new machine has no list of required vars.",
    'node tools/kit-install.mjs "<this project>"'
  );
} else if (staticNoEnv) {
  pass(".env.example says this project needs no environment values");
} else if (!existsSync(localPath)) {
  warn(
    ".env.local does not exist. Forms will log instead of sending, everything else runs.",
    OS === "win32"
      ? "copy .env.example .env.local     then fill values from the Vercel dashboard"
      : "cp .env.example .env.local       then fill values from the Vercel dashboard"
  );
} else {
  const keysIn = (text) =>
    text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#") && l.includes("="))
      .map((l) => l.split("=")[0].trim());

  const wanted = keysIn(readFileSync(examplePath, "utf8"));
  const localText = readFileSync(localPath, "utf8");
  const have = keysIn(localText);
  const filled = new Set(
    localText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#") && l.includes("="))
      .filter((l) => l.split("=").slice(1).join("=").trim() !== "")
      .map((l) => l.split("=")[0].trim())
  );

  const missing = wanted.filter((k) => !have.includes(k));
  const empty = wanted.filter((k) => have.includes(k) && !filled.has(k));

  if (missing.length) {
    warn(
      `.env.local is missing these keys: ${missing.join(", ")}`,
      "Copy them from .env.example, then fill from the Vercel dashboard."
    );
  }
  if (empty.length) {
    warn(
      `.env.local has these keys but they are blank: ${empty.join(", ")}`,
      "Optional vars can stay blank (the app fails open). RESEND_API_KEY blank means forms only log."
    );
  }
  if (!missing.length && !empty.length) pass(".env.local has every key from .env.example");
}

// ── 7. Portability files ──────────────────────────────────────────────
for (const [file, why] of [
  [".gitattributes", "without it, Windows and Mac produce whole-file phantom diffs"],
  [".editorconfig", "keeps editors on every machine writing the same bytes"],
  [".nvmrc", "pins the Node version so a new laptop does not build on a different runtime"],
  [".env.example", "the contract for setting up a new machine"],
]) {
  if (existsSync(join(ROOT, file))) pass(`${file} present`);
  else warn(`${file} is missing (${why}).`, 'node tools/kit-install.mjs "<this project>"');
}

// ── 8. Absolute paths hardcoded in source ─────────────────────────────
// _archive holds a retired version of the app that is excluded from deploy.
// Scanning it only produces noise about code nobody runs.
const SKIP = new Set([
  "node_modules", ".next", ".git", ".vercel", ".claude",
  "dist", "build", "out", "coverage", "_archive", "_LAPTOP-BACKUP",
]);
const CODE = /\.(ts|tsx|js|jsx|mjs|cjs|json|md|command|sh|yml|yaml)$/;
const HARDCODED = /(C:\\+Users\\+|\/Users\/[a-z])/i;
const offenders = [];

function scan(dir, depth = 0) {
  if (depth > 6 || offenders.length > 12) return;
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full, { throwIfNoEntry: false });
    if (!st) continue;
    if (st.isDirectory()) {
      scan(full, depth + 1);
    } else if (CODE.test(entry) && st.size < 400_000) {
      try {
        const text = readFileSync(full, "utf8");
        // A doc that quotes a machine path as the thing NOT to do is not a
        // portability bug. Opt out explicitly rather than softening the check
        // for everyone: put "doctor:allow-paths" in the file, near the reason.
        if (HARDCODED.test(text) && !text.includes("doctor:allow-paths")) {
          offenders.push(full.replace(ROOT, "").replace(/^[\\/]/, ""));
        }
      } catch {
        // unreadable, skip
      }
    }
  }
}
scan(ROOT);

if (offenders.length) {
  warn(
    `These files hardcode a machine-specific path, so they will not work on another laptop:\n     ${offenders.join("\n     ")}`,
    "Replace with paths relative to the repo root."
  );
} else {
  pass("no hardcoded machine paths in source");
}

// ── 9. Git backup status ──────────────────────────────────────────────
// Ask git where the repo root is rather than looking for a .git folder here.
// Several sites keep the code in a Website/ subfolder while the repo is the
// parent, and checking only this folder called them untracked and told you to
// `git init` -- which would nest a second repo inside the real one.
const topLevel = run("git rev-parse --show-toplevel");

if (!topLevel) {
  block(
    "This project is NOT a git repository. OneDrive is the only copy, and it will not survive a reformat or a sync conflict.",
    'git init && git add -A && git commit -m "initial" && git remote add origin <url> && git push -u origin main'
  );
} else {
  if (resolve(topLevel) !== resolve(ROOT)) {
    pass(`tracked by the repo at ${basename(topLevel)} (parent folder)`);
  }
  const remote = run("git remote get-url origin");
  if (!remote) {
    block(
      "Git repo has no remote, so nothing is backed up off this laptop.",
      "git remote add origin <url> && git push -u origin main"
    );
  } else {
    pass(`git remote: ${remote.replace(/\/\/[^@]+@/, "//")}`);
    const dirty = run("git status --porcelain");
    if (dirty) {
      const n = dirty.split("\n").filter(Boolean).length;
      warn(
        `${n} uncommitted change${n === 1 ? "" : "s"} exist only on this laptop.`,
        "Commit and push before you reformat or switch machines."
      );
    } else {
      pass("working tree is clean");
    }
    // No "2>/dev/null": execSync goes through cmd.exe on Windows, which does
    // not understand it, and the check silently reported nothing to push.
    const unpushed = run("git log --oneline @{u}..");
    if (unpushed) {
      warn(
        `${unpushed.split("\n").length} commit(s) are not pushed to the remote.`,
        "git push"
      );
    }
    // Commits pushed from another laptop that this one has never pulled.
    const behind = run("git log --oneline ..@{u}");
    if (behind) {
      warn(
        `${behind.split("\n").length} commit(s) exist on GitHub that this laptop does not have.`,
        unpushed
          ? "This branch has DIVERGED. Fix: git pull --rebase   then: git push\n     Never force-push: that deletes the other laptop's work."
          : "git pull"
      );
    }
  }
}

// ── Report ────────────────────────────────────────────────────────────
const line = "-".repeat(68);
console.log(`\n${line}\n  DOCTOR  ${pkg?.name ?? "project"}  on ${OS}\n${line}\n`);

for (const m of ok) console.log(`  OK       ${m}`);

if (warnings.length) {
  console.log("\n  WARNINGS (you can still work, but read these)\n");
  for (const { m, fix } of warnings) {
    console.log(`  !  ${m}`);
    if (fix) console.log(`     fix: ${fix}`);
    console.log("");
  }
}

if (blockers.length) {
  console.log("\n  BLOCKERS (fix these before working)\n");
  for (const { m, fix } of blockers) {
    console.log(`  X  ${m}`);
    if (fix) console.log(`     fix: ${fix}`);
    console.log("");
  }
  console.log(line);
  console.log(`  ${blockers.length} blocker(s), ${warnings.length} warning(s).`);
  console.log(line + "\n");
  process.exit(1);
}

const nextStep = pkg?.scripts?.verify ? "npm run verify" : pkg?.scripts?.dev ? "npm run dev" : "npm install";
console.log(`\n${line}`);
console.log(`  Ready. ${warnings.length} warning(s). Next: ${nextStep}`);
console.log(line + "\n");
