# Developer Handoff

The project's shared memory. Another developer, or an AI assistant, should be
able to continue confidently after reading only this file.

Last updated: 16 September 2026.

---

## 1. What this is

The wedding website for **John Carlo Alcantara and Kristinne Monzon**,
17 October 2026 at 4:00 PM in Rosario, Cavite, 100 guests, officiated by
Pastor Jomar under Christian rites. Hashtag `#CARLOobNgdiyoskayKRISTINNE`,
which reads as "Carlo, kaloob ng Diyos kay Kristinne".

Commissioned through Erick Cabal, who is simultaneously the best man, the
emcee, and the developer. That triple role shows up in the copy, which is
warmer and more direct than a vendor would write, and it is intentional.

The couple's brief, from the workbook: *"Ilabas namin kung sino talaga kami:
makulit, masayahin, simple lang, at enjoy lang lahat."*

## 2. Current state, honestly

**Built, verified, not deployed.** All nine public pages, the three guest
forms, the admin dashboard, the full reception programme, and a privacy page.
`npm run verify` is green. Lighthouse: 76 to 90 performance, 96 to 100
accessibility, 100 best practices, 100 SEO, under the mobile profile.

**What does not exist yet**, in the order it has to happen:

1. A git remote. The repository is initialised with one commit and has never
   been pushed. OneDrive and this laptop are the only copies.
2. A Vercel project.
3. A Supabase project. Until it exists every form says, honestly, that it is
   not switched on.
4. `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` on the host.
5. The domain. Every canonical URL, the sitemap, `robots.txt` and the social
   image URLs are built for `carloandkristinne.com`, which has not been
   bought. See section 6.

The site's own RSVP deadline is 30 September 2026.

## 3. Tech stack, exact versions

Read from `node_modules` on 16 September 2026, after the security update.

| Layer | Package | Version |
|---|---|---|
| Runtime | Node | 24.19.0 (`.nvmrc` pins 24, `engines` allows 20.10+) |
| Package manager | npm | 11.17 |
| Framework | next | 16.3.5 |
| UI | react, react-dom | 19.2.8 |
| Language | typescript | 5.9.3, strict |
| Styling | tailwindcss | 3.4.19 |
| | tailwindcss-animate | 1.0.7 |
| | postcss, autoprefixer | 8.5.23, 10.5.4 |
| Validation | zod | 4.4.3 |
| Database client | @supabase/supabase-js | 2.110.8 |
| Email | resend | 6.18.0 |
| Icons | lucide-react | 1.25.0 |
| Class helpers | clsx, tailwind-merge, class-variance-authority | 2.1.1, 2.6.1, 0.7.1 |
| Lint | eslint, eslint-config-next | 9.39.5, 16.2.11 |
| Script runner | tsx | 4.23.1 |

Deliberate majors NOT taken, each a migration rather than a bump: ESLint 10,
Tailwind 4, TypeScript 7, tailwind-merge 3. None is a security issue.

`eslint-config-next` sits one minor behind `next` after the security update
moved only the vulnerable packages. Lint passes; align it when convenient.

## 4. Every service, and where the account lives

| Service | Role | Account | Status |
|---|---|---|---|
| GitHub | Code and history | Erick's, `ericksleisure@gmail.com` | Repo not created |
| Vercel | Hosting and deploys. Runs `npm run check && npm run build` | Erick's | Project not created |
| Supabase | Postgres (four tables) and Storage (one public bucket) | To be created on Erick's account | Not created |
| Resend | Sends the RSVP notification email. Optional | To be created | Not created |
| Upstash Redis | Shared rate limiting across serverless instances. Optional | Not needed unless the address leaks past the guest list | Not created |
| Domain registrar | `carloandkristinne.com` | Not bought | Blocking the printed invitation |

No payments, no analytics, no third-party scripts of any kind.

## 5. Every environment variable, and where its value comes from

`.env.example` is the contract. Every variable the code reads is listed there
and verified by the QA pass (`grep process.env` against the file).

| Variable | Required | Where the value comes from |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes for production | The real public address. Drives canonicals, sitemap, robots, OG image URLs, JSON-LD. Build time |
| `ADMIN_PASSWORD` | Yes for the admin area | You choose it. No default exists; `requiredEnv()` throws without it |
| `ADMIN_SESSION_SECRET` | Yes for the admin area | `openssl rand -base64 32`. Signs the session cookie |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes for any saving | Supabase dashboard, Project Settings, API. Also allowlists the image host at build time |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Listed for completeness | Same place. The app never actually uses it; RLS grants it nothing |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes for any saving | Same place. Bypasses RLS. Server only, `lib/store.ts` is the only importer |
| `RESEND_API_KEY` | No | resend.com. Without it, email is logged and skipped |
| `FROM_EMAIL` | With Resend | A verified sending domain on Resend. Never a Gmail address, DMARC fails it |
| `CONTACT_TO_EMAIL` | With Resend | Where RSVP notifications land |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | No | upstash.com. Without them, rate limiting is in-memory per instance |
| `NODE_ENV` | Set by Next | Only read to make the cookie `secure` in production |

**The source of truth for every production value is the provider dashboard,
not a laptop.** `.env.local` is gitignored, syncs to OneDrive anyway, and
does not survive a reformat.

## 6. Running locally

```bash
npm run doctor       # does THIS laptop have what it needs? Zero dependencies
npm run clean        # delete build caches. Always safe
npm install
cp .env.example .env.local   # then fill from the dashboards
npm run dev          # http://localhost:3028
npm run verify       # typecheck + lint + check + build. The definition of done
```

**The dev server on a synced OneDrive folder.** On this laptop `npm run dev`
was found dying silently with no output at all while `next build` worked in
eleven seconds. The cause was an unstamped `node_modules` and `.next` synced
in from elsewhere. `npm run clean` then `npm install` fixed it. If `next dev`
prints nothing, do that before debugging anything else, and use the
`wedding-prod` entry in `.claude/launch.json`, which serves the production
build, to look at the site in the meantime.

**npm 11.17 "allow-scripts" warnings on install** for esbuild, sharp and
unrs-resolver are benign. Those packages ship their Windows binaries as
separate platform packages, so the blocked post-install scripts are only
fallback checks. `esbuild.exe` and the sharp binary are both present after a
normal install.

**Testing the admin locally** needs `ADMIN_PASSWORD` and
`ADMIN_SESSION_SECRET` in `.env.local`. Fake values are fine; they are read at
runtime, not build time.

## 7. Deploying

Not yet wired. When it is:

1. Push to `main` on GitHub.
2. Vercel runs `npm run check && npm run build` (set in `vercel.json`) and
   deploys. Preview deploys on other branches.
3. Every variable in `.env.example` must be set in the Vercel project first.

Pre-deploy gate, all green:

1. `npm run verify`
2. Review the changed pages at 375, 768, 1280 and 1440
3. Zero em dashes, zero console errors, no broken links
4. Docs updated in the same session, this file included

## 8. Folder structure and where things live

```
app/
  page.tsx                     home
  our-story/ details/ programme/ entourage/ gallery/ guestbook/ rsvp/ privacy/
  actions/                     rsvp.ts, guestbook.ts, gallery.ts (Server Actions)
  admin/
    login/                     page, form, actions (signIn, signOut)
    (dashboard)/               layout (requireAuth), overview, rsvps, guestbook,
                               photos, manual, actions.ts, rsvps/export/route.ts
  layout.tsx                   fonts, metadata defaults, ribbon, JSON-LD
  error.tsx not-found.tsx      500 and 404
  sitemap.ts robots.ts manifest.ts favicon.ico
components/
  layout/                      Header, Footer, MobileNav, SkipLink
  sections/                    Hero, AtAGlance, DressCode, CtaBanner, Marquee, previews
  forms/                       RsvpForm, GuestbookForm, UploadForm, FormStatus (+Honeypot)
  ui/                          Button, Card, Field, Badge
  Aurora Ribbon Monogram Reveal PhotoFrame Pending Section PageHeader Countdown GalleryGrid
lib/
  constants.ts                 EVERY wedding fact, with pending flags. The programme.
  store.ts                     the only module that touches Supabase
  auth.ts admin-guard.ts       signed cookie session, requireAuth()
  sanitize.ts rate-limit.ts    input hygiene, IP rate limit
  email.ts seo.ts csv.ts       Resend wrapper, metadata builders, CSV export
  utils.ts fonts.ts types.ts
styles/globals.css             the semantic layer: on-ink, btn, card, eyebrow, field
tailwind.config.ts             the palette and every design token
supabase/migrations/           0001_init, 0002_rls, 0003_storage
scripts/                       doctor, clean, stamp, qa-check, grammar-check,
                               security-check, css-check
docs/                          this file, USER-MANUAL.md, source/ (gitignored workbooks)
.claude/launch.json            dev and prod preview entries, port 3028
```

**Where to change what:**

| Want to change | Go to |
|---|---|
| Any date, name, venue, time, FAQ answer, programme item | `lib/constants.ts` |
| A colour or type size | `tailwind.config.ts`, then `styles/globals.css` for semantic classes |
| Section rhythm, the folio numerals | `components/Section.tsx` |
| The hero composition | `components/sections/Hero.tsx` |
| Form validation rules | the zod schema at the top of each `app/actions/*.ts` |
| Rate limits | the `rateLimit(key, limit, windowSeconds)` call in each action |
| What the admin can do | `app/admin/(dashboard)/actions.ts` |
| Database reads and writes | `lib/store.ts` only |
| Page titles and social cards | `lib/seo.ts` `pageMeta()`, and `app/layout.tsx` for the home |
| The privacy page's claims | `app/privacy/page.tsx`, and check them against the actions |

## 9. Architecture in one paragraph

Server Components by default, reading through `lib/store.ts`, which is
marked `server-only` and is the sole importer of the service-role Supabase
client. Client components exist only at the leaves: header, mobile nav,
countdown, reveal wrapper, gallery lightbox, and the four forms. Each form is
a native `<form action={serverAction}>` with `useActionState`, no
react-hook-form. Every Server Action runs: honeypot, rate limit, zod,
sanitise, persist, then email, then `revalidatePath`. Every admin mutation and
the CSV route handler call `requireAuth()` on their first line, because a
Server Action is a public HTTP endpoint whether or not anything links to it.
`proxy.ts` (Next 16's name for middleware) only redirects; it is not the
security boundary.

## 10. Database schema

Postgres on Supabase. Migrations are numbered and never edited after they run.

**`rsvps`**: `id` uuid, `created_at`, `updated_at`, `name` text 2 to 120,
`email` text nullable to 160, `phone` text nullable to 24, `attending` enum
yes/no, `party_size` int 0 to 20, `guests` jsonb `[{name, isChild}]`,
`dietary` text nullable to 400, `song_request` text nullable to 200,
`message` text nullable to 1200.

**`guestbook`**: `id`, `created_at`, `updated_at`, `name` text 2 to 80,
`message` text 4 to 800, `status` enum pending/approved/hidden.

**`photos`**: `id`, `created_at`, `updated_at`, `storage_path` text unique
(a server-generated UUID plus extension, never the client filename),
`uploader_name` nullable to 80, `caption` nullable to 240, `status` enum,
`width` and `height` int nullable (reserved, unused).

**`audit_log`**: `id`, `created_at`, `actor` text default admin, `action`
text, `detail` text. Append-only. Written on every admin mutation and every
CSV export.

**RLS is enabled on all four tables with no policies at all**, and `anon` and
`authenticated` have every grant revoked. That is deliberate: nothing in the
browser ever needs the database. Do not add a "public read approved rows"
policy as a convenience; it would expose guest names to anyone reading the
JavaScript bundle.

**Storage bucket `guest-photos`** is public for reads, on purpose: the couple
asked that anyone be able to download originals with no account and no
expiring link. Paths are unguessable UUIDs. There is no write policy, so no
client can upload directly; every object is written by the server after a
real MIME and size check. 12 MB limit, JPEG, PNG, WebP, HEIC and HEIF.

## 11. Third-party integrations, and how each degrades

| Integration | Without it |
|---|---|
| Supabase | Every read returns empty, every write returns `not-configured`, every form says so plainly. The public site renders fully |
| Resend | `sendMail` logs and returns `{skipped: true}`. The RSVP row is already saved before send is attempted, so no reply can be lost to a mail outage |
| Upstash | Rate limiting falls back to an in-memory map, per serverless instance. Weak, stated plainly in `rate-limit.ts`, acceptable for 100 invited guests |

## 12. Design tokens

All in `tailwind.config.ts`. No component names a hex value; the semantic
layer in `globals.css` maps tokens to intent.

**Palette.** The couple's motif is "blue, violet, black, couple in white".
**That describes the wedding, not the website.** The first build read it as a
page background and shipped a near-black site. It was coherent and it was
wrong: sombre, and hard to read on a phone outdoors. White is the couple, so
white is the ground.

| Token | Hex | Role |
|---|---|---|
| `brand.paper` | `#FFFFFF` | The ground |
| `brand.paper-200` | `#F7F6FC` | A faint tint band for scroll rhythm. Not a second contrast band |
| `brand.ink` | `#05060E` | Type, the primary button, and the one dark band per page |
| `brand.line` / `-strong` | `#E6E4F0` / `#D2CFE3` | Hairlines |
| `brand.blue-500` | `#3A55D9` | Cool accent. 5.8:1 on paper |
| `brand.violet-500` | `#8B3FD4` | Warm accent, the eyebrow, the focus ring. 5.4:1 on paper |

Blue and violet appear only as a soft wash, the hairline rule, the monogram
ring and the dress-code swatches, never as a large flat fill. Black appears as
a field exactly once per page, the closing CTA, using `.on-ink`, which flips
every child automatically.

**Contrast floors, measured on the rendered page.** Body copy is 75 percent
ink (9.5:1). **60 percent is the muted floor**: 55 measures 4.47:1 and fails.
Placeholders were at 50 (3.81:1) until the September QA pass and are now 60.
The decorative folio numerals are 15 percent by design and are exempt as pure
decoration; Lighthouse will always flag them.

**Type.** Bodoni Moda (display) and Inter (body), via `next/font`, with
`Didot, Georgia, serif` and `system-ui, sans-serif` fallbacks. Display
sizes are clamp tokens `display-2xl` (up to 8rem) down to `display-md`, so
markup never carries a breakpoint ladder. `html { font-size: 95% }` with
inputs pinned to 16px so iOS Safari does not zoom.

**Spacing and motion.** Sections are `py-16 sm:py-20 lg:py-28`. Container
caps at 1200px. Eyebrow tracking is `tracking-eyebrow` (0.28em), one token,
never a literal. Tiny captions (Badge, PendingChip, the countdown unit labels)
use `tracking-wider`. Stagger is `index * 80` ms. Easing is always expo-out.
Reduced motion is honoured by a blanket CSS rule.

**The signature moves, and do not undo them.** The ribbon threading the whole
document (`Ribbon.tsx`), the asymmetric left-aligned hero with the names at
`display-2xl`, the ghosted folio numerals in the margin, and `SectionHeading`
defaulting to left. A previous version centred everything and read as a
template. Colour was never the problem with it; composition was.

## 13. Coding conventions

- Components `PascalCase`, `lib/` files `kebab-case`, routes `kebab-case`
- Route groups parenthesised: `app/admin/(dashboard)/`
- **Never an em dash**, anywhere, including comments. `npm run grammar` fails the build
- Every wedding fact from `lib/constants.ts`. Never invent a missing one;
  mark it `pending: true` and it renders as a "To be confirmed" chip
- No hex in components
- `"use client"` at the leaf, never at a layout
- Zod v4: `z.flattenError(error)`, not `error.flatten()`
- Next 16: `proxy.ts` not `middleware.ts`; `npm run lint` calls eslint
  directly, `next lint` is gone
- No money, vendors or budget anywhere in this repository. The workbook in
  `docs/source/` has it and is gitignored

## 14. Checks and how they run

There are no unit or end-to-end tests yet. There are five static checks plus
the compiler and the build, chained by `npm run verify`:

| Command | Catches |
|---|---|
| `npm run typecheck` | Type errors. Run separately from build; together they have OOM-killed with exit 137 |
| `npm run lint` | ESLint, native flat config |
| `npm run qa` | Broken internal links, missing alt, missing metadata, images over 300 KB, stray console.log, missing required docs |
| `npm run grammar` | Em dashes, en dashes outside numeric ranges, double spaces in prose, common misspellings |
| `npm run security` | Fallback secrets, hardcoded keys, `dangerouslySetInnerHTML` outside JSON-LD, service-role client in a client component, admin actions missing `requireAuth`, populated secrets in `.env.example` |
| `npm run css` | Compiles `globals.css`. An invalid utility in `@apply` is a 500 on every route that nothing else catches |
| `npm run build` | The production build, with its own TypeScript pass |

The three Playwright tests the playbook asks for (RSVP flow, admin login, one
mobile pass) are still to be written. The September QA pass did all three by
hand; see section 17.

## 15. Security posture

- Signed cookie session, HMAC-SHA-256 over Web Crypto so it runs on the Edge,
  8-hour expiry, `httpOnly`, `secure` in production, `sameSite: lax`, fails
  closed if the secret is missing
- Constant-time password comparison
- `requireAuth()` first line of every admin action and the CSV route
- Login rate limited 5 per 15 minutes per IP
- All three public forms: honeypot, IP rate limit (RSVP 6/15min, guestbook
  5/10min, upload 8/10min), zod, sanitise, persist-then-send
- Uploads checked for real MIME and size server side; land as pending
- Security headers in `vercel.json`: nosniff, SAMEORIGIN, strict referrer,
  permissions policy, HSTS preload. `X-Robots-Tag: noindex` on `/admin`
- CSV export guards against formula injection and carries a UTF-8 BOM
- No secrets in the repo or in git history, verified
- `npm audit`: 0 vulnerabilities as of 16 September 2026

**Not implemented, deliberately.** A Content Security Policy: a nonce-based
one forces dynamic rendering everywhere and kills CDN caching on a mostly
static site; a static one needs `unsafe-inline` for the JSON-LD blocks. Start
with `Content-Security-Policy-Report-Only` if added. Cloudflare Turnstile:
honeypot plus rate limit is proportionate for 100 invited guests; add it if
the address ever spreads.

**Known residual risk.** OneDrive syncs `.env.local` to Microsoft's cloud.
Gitignore is not a security control here. Rotate anything sensitive.

## 16. Known issues and technical debt

| Item | Note |
|---|---|
| Not pushed, not deployed, no domain | Section 2. Everything else is downstream |
| `og.png` and `apple-touch-icon.png` are aurora fields with no text | Regenerate with the couple's names and date once a photograph exists |
| `favicon.ico` is generated from `icon.svg`, which still uses the dark-build ink background | Reads fine as a favicon; matches the OG image. Regenerate together |
| No Playwright tests | Section 14 |
| No CI workflows | Copy the UPWorth set, with triggers enabled |
| Photo `width`/`height` columns unused | Store real dimensions at upload to remove the last gallery CLS risk |
| In-memory rate limiter is per instance | Set Upstash if the address leaks |
| HEIC from some desktop browsers reports an empty MIME type | iOS Safari, the main HEIC source, reports it correctly. Watch the upload rejections after the wedding |
| Lighthouse performance 76 to 90 on mobile | 321 KB page, CLS 0. Driven by hydration on a 4x throttled CPU and the display heading waiting on Bodoni. Levers: fewer `Reveal` wrappers on the home page, `font-display: optional` for the display face |
| Marquee direction | `PROJECT_RULES.md` says decorative moving text animates left to right. The marquee translates content leftward (text enters from the right, like a ticker). The code comment claims compliance by "reading order". Ambiguous; left for a decision |
| Manual naming | `PROJECT_RULES.md` mandates `USER_MANUAL.md` and `handoff.md` at the root. The September QA brief asked for `docs/USER-MANUAL.md` and `docs/DEVELOPER-HANDOFF.md`. Both exist: the docs/ files are canonical, the root files are pointers. Reconcile the rule |

## 17. Decisions worth keeping, and session notes

### The palette flip (July 2026)

The first build took "black" from the motif as the page ground. The client's
reaction: "it's so dark, do you think someone who has a wedding will like
this?" They were right, and the diagnosis was a misread brief, not taste. The
flip was cheap because no component contained a hex: a palette swap in
`tailwind.config.ts`, a rewritten semantic layer, one `.on-ink` class. If a
future session is tempted to "restore the dramatic version", that is the
reason not to.

### `loading.tsx` lives only on the admin dashboard

A root `loading.tsx` wraps every route in a Suspense boundary, so Next streams
the spinner as the first paint and swaps the real content in with JavaScript,
for pages that are statically prerendered and fetch nothing. Moved to
`app/admin/(dashboard)/`, where there genuinely is something to wait for.
`/details` HTML went from 126 KB to 108 KB. Found by reading the production
HTML, not by reasoning.

### The countdown reads the clock only on the client

A server snapshot of `Date.now()` on a prerendered page is frozen at build
time. The server renders same-size placeholder boxes; the client fills them.
No layout shift. The footer copyright fell into the same trap and now uses
`WEDDING_DAY.year`.

### The programme (3 September 2026)

Built first as a short twelve item programme of our own design. The couple
then sent two documents that replaced the premise: the coordinator's
on-the-day timeline (Amari Events), which fixes every clock time, and the
host's programme sheet, which fixes the order of twenty-six items. The couple
chose the full running order.

The timeline corrected three things the site had been asserting from the
older workbook: a 5:00 AM dawn pictorial (the real entourage call is 11:30
AM), "reception immediately after the ceremony" (doors open at 7:15 PM, over
two hours after the ceremony ends), and "two places, five minutes apart".

**How the documents were joined.** The timeline fixes doors 7:15, "grand
entrance, reception ready" 7:30, and "programme starts" 8:00. The programme
sheet puts the grand entrance at item VI after four other items. Those
reconcile only one way: the entrance sequence begins at 7:30 and the couple
are presented at 8:00. The durations were chosen so the derived clock lands
on 8:00 PM exactly for the grand entrance. **Amari should confirm this before
anything is printed.** If the couple walk in at 7:30, everything after shifts
half an hour earlier.

Reception items carry `minutes` only; `RECEPTION_TIMELINE` derives offset and
clock from the 7:15 PM doors. The durations are ours; the sheet has none.
Total 255 minutes, ending about 11:30 PM. Kristinne's dance-off opens the
evening, led by Erick, winners first to the couple's photo and the buffet.
Panalangin is sung by the room at the cake cutting.

**Still open: the gap.** Guests are free around five and cannot get in until
7:15. The site warns them plainly. That is not a solution.

### The QA pass (16 September 2026)

Full ten-section pass. Found and fixed: `colorScheme: "dark"` and a black
theme colour left over from the dark build in the viewport and manifest;
placeholders at 50 percent ink (3.81:1); the countdown labels wrapping
mid-word at every desktop width; no `favicon.ico`, a console 404 on every
page; the lightbox claiming a focus trap it did not have; the logo link's
accessible name not matching its visible text; email templates hardcoding
wedding facts; no canonical on the homepage; no privacy page on a site that
collects allergy information; no `verify` script; stale dark-build comments;
`.gitignore` missing the `.claude` lines. Six npm vulnerabilities, two of them
in the image library that processes guest uploads, fixed within range.

Verified by hand: every route and link, all three forms on validation,
not-configured, honeypot and rate-limit paths, the full admin login, pages,
export and sign-out, the mobile menu, five viewport widths, keyboard focus,
heading order, labels, landmarks, and a measured contrast audit of 264 text
elements.

**One correction from that pass worth recording.** A first test reported the
CSV had no BOM. It does; `fetch().text()` in the browser silently consumes a
leading BOM when decoding. Check bytes, not strings.

**Note for whoever tests next.** The in-app browser pane runs with
`visibilityState === "hidden"` at times, so `requestAnimationFrame` may not
fire and `Reveal` content stays at opacity 0 in screenshots. Force
`.is-visible` on `.reveal` elements before capturing, and use
`behavior: "instant"` for programmatic scrolls, because the smooth scroll in
`globals.css` never completes there.

## 18. Future improvements

- A private, tokenised guest link so each invitation prefills its own names
- Bulk download of the whole album as a zip, built server side
- A seating-plan view generated from the RSVP data
- Real image dimensions captured at upload, to remove all gallery CLS
- A Filipino language toggle, if enough guests would use it

---

Built with care by [Erick Cabal](https://erickcabal.com).
