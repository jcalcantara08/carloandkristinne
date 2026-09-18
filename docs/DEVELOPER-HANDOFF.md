# Developer Handoff

The project's shared memory. Another developer, or an AI assistant, should be
able to continue confidently after reading only this file.

Last updated: 17 September 2026.

---

## 1. What this is

The wedding website for **Kristinne Monzon and John Carlo Alcantara**,
17 October 2026 at 4:00 PM. Ceremony at Jesus the Counselor Church, 428A
Saint Francis Subdivision, San Juan I, General Trias, Cavite; reception at
Servando's Restaurant, beside MV Soriano Medical Clinic, Rosario, Cavite.
100 guests, officiated by Pastor Jomar Antalan and Pastora Lorna Antalan
under Christian rites. Hashtag `#CARLOobngDiyoskayKRISTINNE`, which reads
as "Carlo, kaloob ng Diyos kay Kristinne". Kristinne's name is printed first
on the invitation and the monogram is KC; the site follows the print.

Commissioned through Erick Cabal, who is simultaneously the best man, the
emcee, and the developer. That triple role shows up in the copy, which is
warmer and more direct than a vendor would write, and it is intentional.

The couple's brief, from the workbook: *"Ilabas namin kung sino talaga kami:
makulit, masayahin, simple lang, at enjoy lang lahat."*

## 2. Current state, honestly

**Built, verified, and live at https://carloandkristinne.vercel.app since
17 September 2026.** All nine public pages, the three guest forms, the admin
dashboard, the full reception programme, and a privacy page.
`npm run verify` is green. Lighthouse: 76 to 90 performance, 96 to 100
accessibility, 100 best practices, 100 SEO, under the mobile profile.

**What exists.** GitHub: `jcalcantara08/carloandkristinne`, on Carlo's own
account (created Public; should be made Private). Vercel: team
`carloandkristinne`, project `carloandkristinne`, auto-deploys from `main`.
`NEXT_PUBLIC_SITE_URL` is set to the vercel.app address, so canonicals are
correct.

**Fully wired since 17 September 2026.** Supabase (project
`hcekfkxuktnmkxivrecq`, Seoul) holds the four tables and the photo bucket,
the migrations were run through the SQL Editor, and a live RSVP, guestbook
message and photo upload were verified against the database. Resend is
connected in test mode. The admin secrets are set on Vercel.

**Pending on the hosting side (17 September 2026, later):** migration
`0004_recycle_bin_archive_content.sql` must be run in the Supabase SQL Editor
and `CRON_SECRET` set on Vercel. Until the migration runs, the dashboard's
Archive, Delete and Edit the website actions fail quietly (the store logs the
column or table error) and the public pages fall back to the defaults in
code. Until the secret is set, the recycle bin never purges by itself.

**What does not exist yet:** the domain. When `carloandkristinne.com` is
bought, add it in Vercel Domains, change `NEXT_PUBLIC_SITE_URL` to match,
verify the domain in Resend and change `FROM_EMAIL`, then redeploy.

The RSVP deadline, on the site and on the printed invitation, is 5 October 2026.

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
| GitHub | Code and history | Carlo's account, `jcalcantara08` | `jcalcantara08/carloandkristinne`. Make it Private |
| Vercel | Hosting and deploys. Runs `npm run check && npm run build` | Team `carloandkristinne` | Live at carloandkristinne.vercel.app |
| Supabase | Postgres (four tables) and Storage (one public bucket) | Carlo's GitHub login, org `carloandkristinne` | Project `hcekfkxuktnmkxivrecq`, Seoul. Live |
| Resend | Sends the RSVP notification email | Carlo's GitHub login | Test mode: delivers only to the account address until a domain is verified |
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
| `SUPABASE_SERVICE_ROLE_KEY` | Yes for any saving | Same place. Bypasses RLS. Server only, `lib/store.ts` is the only importer |
| `RESEND_API_KEY` | No | resend.com. Without it, email is logged and skipped |
| `FROM_EMAIL` | With Resend | `onboarding@resend.dev` until the domain is verified in Resend, then `noreply@carloandkristinne.com`. Never a Gmail address, DMARC fails it |
| `CONTACT_TO_EMAIL` | With Resend | Where RSVP notifications land. In test mode this must be the Resend account's own address |
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

Wired and working since 17 September 2026. The first deployment went live 60
seconds after the first push.

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

**The three shelves (0004).** `rsvps`, `guestbook` and `photos` each carry
`archived_at` and `deleted_at` (timestamptz, nullable, partial index on
`deleted_at`). Both null is active; `archived_at` set is archived (kept for
good, hidden); `deleted_at` set is the recycle bin. `lib/store.ts` filters
every list by `RecordView` and the public site only ever reads `active`.
`setRecordShelf()` moves between shelves (trash clears the archive stamp so a
restore lands active), `deleteForGood()` is the only hard delete (it removes
the storage object for a photograph), `listTrash()` unifies the bin, and
`purgeTrash()` removes anything older than `TRASH_DAYS` (14). The purge runs
from `app/api/cron/purge/route.ts`, scheduled in `vercel.json` at 18:00 UTC
(02:00 Manila) and gated by `CRON_SECRET`; without the secret it refuses every
call and the bin simply keeps things.

**`site_docs`** (0004): `key` text primary key, `data` jsonb, `updated_at`.
One document per key; today only `content`, the words and photographs on the
public pages. RLS on, no policies, service role only, like the rest.

**Storage bucket `site-assets`** (0004): the couple's own photographs on the
pages (the hero, for now). Same rules as `guest-photos`: public read, server
writes only, random UUID names, 12 MB, JPEG/PNG/WebP/HEIC.

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

## 10a. Editable page content

`lib/content-schema.ts` is the whole model, with no server imports so the
client nav can read the section list:

- `SiteContent`: every headline, paragraph, list and photograph on the
  public pages. Strings only; `""` means "not set" and is never rendered.
- `DEFAULT_CONTENT`: the defaults, built from `lib/constants.ts` and the copy
  that used to sit in each page.
- `CONTENT_SECTIONS`: one section per public page, listing its fields.
  Scalar fields are `text`, `textarea`, `url` or `image`; a `list` field
  names its item fields and the `required` key that decides whether a row
  exists (blank it to remove the row). Lists are posted as numbered rows
  under `path.N.key` with a hidden `path.count`.
- `mergeContent()`: stored over defaults, key by key for objects, whole for
  arrays and scalars, so a field added later in code never breaks an older
  saved document.
- `receptionTimeline()` and `clockToMinutes()`: the reception clock is
  derived from `programme.doors` and each item's minutes, as before.

`lib/content.ts` (server only) is `getContent()`, the merge wrapped in React
`cache()` so a page's sections read the document once per request, and
`saveContent()`. Every public page and home section calls `getContent()`;
the pages stay static (`○` in the build output) because nothing reads
cookies or headers, and the editor's action calls `revalidatePath()` on every
public path after a save.

The editor is `app/admin/(dashboard)/pages/page.tsx` with its action in
`pages/actions.ts`: sanitise with `normalizeText` / `normalizeMultiline`,
keep only http(s) URLs, cap text at 600 and paragraphs at 6000 characters and
lists at 60 rows, upload an image through `uploadSiteAsset()`, save, audit,
revalidate, redirect back with `saved=1` or `error=`.

`components/EditPageButton.tsx` draws "Edit this page" on public pages for a
signed-in owner. It reads `ck_admin_hint`, a non-httpOnly companion cookie
set and cleared beside the session cookie in `app/admin/login/actions.ts`.
The hint grants nothing; it only decides whether the button is drawn, and it
is read with `useSyncExternalStore` on the client so the static HTML is the
same for everyone.

What stays in `lib/constants.ts` on purpose: the date and time (countdown,
calendar, email), `WEDDING_DAY`, `RSVP.maxPartySize` and the form limits,
`GALLERY` limits, `NAV`, `SITE`, the attire palette and dress-code swatches.
Non-negotiable 3 in `CLAUDE.md` now reads: every wedding fact comes from
`lib/constants.ts` or the site document; never hardcode one in a component.

## 11. Third-party integrations, and how each degrades

| Integration | Without it |
|---|---|
| Supabase | Every read returns empty, every write returns `not-configured`, every form says so plainly. The public site renders fully |
| Resend | `sendMail` logs and returns `{skipped: true}`. The RSVP row is already saved before send is attempted, so no reply can be lost to a mail outage |
| Upstash | Rate limiting falls back to an in-memory map, per serverless instance. Weak, stated plainly in `rate-limit.ts`, acceptable for 100 invited guests |

## 12. Design tokens

All in `tailwind.config.ts`. No component names a hex value; the semantic
layer in `globals.css` maps tokens to intent.

**Palette.** Taken from the couple's attire guides of 17 September 2026,
which name five blues and no violet: dark steel, dusty, ice, light blue grey,
cornflower. The earlier electric blue into purple was read off the workbook's
one-line motif and looked like a different event next to the real dresses.
White stays the ground; ink is cooled to navy-black.

| Token | Hex | Role |
|---|---|---|
| `brand.paper` | `#FFFFFF` | The ground |
| `brand.paper-200` | `#F4F7FA` | Ice-blue tint for scroll rhythm and interior page headers. Not a contrast band |
| `brand.ink` | `#0B1220` | Type, the primary button, the one dark band. 18.7:1 |
| `brand.line` / `-strong` | `#DDE5EC` / `#C4D0DB` | Hairlines |
| `brand.plum-500` | `#5A3D78` | The invitation's type colour. Eyebrow, links, focus ring. 8.9:1 |
| `brand.plum-300` | `#C3AEDD` | The eyebrow on the dark band. 9.3:1 on ink |
| `brand.mauve-500` | `#8C5A8C` | The rose purple of the names on the save the date. The ampersand. 5.3:1 |
| `brand.mauve-300` | `#D9B8D4` | The ampersand on the dark band. 10.5:1 on ink |
| `brand.steel-500` | `#3B5068` | Dark steel blue from the attire guide. Swatches and the monogram ring only since the rebrand |
| `brand.cornflower-400` | `#6B8BC9` | The guide's own cornflower. Washes and swatches only |
| `brand.dusty-400` | `#7A97B3` | The bridesmaids' blue. Swatches and the monogram ring |

**The plum rebrand (17 September 2026, morning).** The couple sent the
printed invitation suite: plum type, rose-purple names, pink and lavender
and dusty blue florals on white, a KC monogram with Kristinne's name first.
Every `brand-steel-*` and `brand-cornflower-*` class in `app`,
`components` and `styles` was renamed to `brand-plum-*` and
`brand-mauve-*` (29 files), the `aurora` gradients and the shadow tints
moved to the purples, and the monogram became KC on a plum-to-dusty-blue
ring. The steel and cornflower scales remain in the config for swatches.
`og.jpg` is rendered from `scratchpad/og.html` with headless Chrome so the
real fonts are used; `icon.svg`, `favicon.ico` (an ICO of 16, 32 and 48 px
PNGs) and `apple-touch-icon.png` are generated from it with sharp.

Only plum-500 and mauve-500 ever carry text. Everything else is a wash,
a rule, a ring or a swatch. Black appears as a field exactly once per page,
the closing CTA, using `.on-ink`, which flips every child automatically.
`ATTIRE_PALETTE` in constants holds the five named swatches for the dress
code page. Each `DRESS_CODE` row also carries an `outfit`: the garments as
drawn on the two attire guides of 17 September 2026 (a three-piece dark steel
suit for the best man; floor-length dusty blue gowns with straps, halter or
off-the-shoulder for the bridesmaids; black suit, white shirt, blue tie for
the groomsmen). The outfit is editable per row under Edit the website,
Details. `DressCode.tsx` falls back to the code default for a saved row of
the same role that predates the field, so an older saved document never
shows a colour with no outfit.

**Contrast floors, measured on the rendered page.** Body copy is 75 percent
ink (9.5:1). **60 percent is the muted floor**: 55 measures 4.47:1 and fails.
Placeholders were at 50 (3.81:1) until the September QA pass and are now 60.
The decorative folio numerals are 15 percent by design and are exempt as pure
decoration; Lighthouse will always flag them.

**Type.** Cormorant Garamond (display, weights 500 and 600) and Inter
(body), via `next/font`, with `Garamond, Georgia, serif` and `system-ui,
sans-serif` fallbacks. Display sizes are clamp tokens `display-2xl` (up to
6.5rem) down to `display-md`, so markup never carries a breakpoint ladder. `html { font-size: 95% }` with
inputs pinned to 16px so iOS Safari does not zoom.

**Spacing and motion.** Sections are `py-16 sm:py-20 lg:py-28`. Container
caps at 1200px. Eyebrow tracking is `tracking-eyebrow` (0.28em), one token,
never a literal. Tiny captions (Badge, PendingChip, the countdown unit labels)
use `tracking-wider`. Stagger is `index * 80` ms. Easing is always expo-out.
Reduced motion is honoured by a blanket CSS rule.

**Composition.** Centred and classic, on purpose. `SectionHeading` and
`PageHeader` default to centre; only a heading that sits beside a card in a
two-column grid is left-aligned. There is no decoration: the ribbon, the
drifting colour blobs, the ghosted folio numerals and the hashtag marquee
were all removed on 17 September 2026 after the client called the result
ugly. The research behind that decision is in section 17. Do not bring them
back to "make it unique"; that was tried, and the answer from every
well-liked wedding site is a photograph of the couple.

## 13. Coding conventions

- Components `PascalCase`, `lib/` files `kebab-case`, routes `kebab-case`
- Route groups parenthesised: `app/admin/(dashboard)/`
- **Never an em dash**, anywhere, including comments. `npm run grammar` fails the build
- Every wedding fact from `lib/constants.ts`. Never invent a missing one;
  mark it `pending: true`. `SHOW_PENDING` in constants decides whether that
  renders as a "To be confirmed" chip (planning) or nothing at all (live, the
  current setting). Sections with no real content are not rendered either
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
| No domain | Section 2. Also blocks real email sending |
| Supabase legacy keys | The project uses the legacy `service_role` JWT, which Supabase is phasing out in favour of `sb_secret_` keys. Both work with supabase-js 2.x. Migrate when convenient: new key in Vercel, redeploy, disable legacy keys in Supabase |
| Three QA test rows in the live database | An RSVP, a guestbook message and a photo, all named "QA Test" or "delete me". Delete them from the admin dashboard; doing so also exercises the delete flow |
| Prayer speaker, first-dance song, parents' dance songs | Pending on the programme sheet; the copy says so honestly |
| No Playwright tests | Section 14 |
| No CI workflows | Copy the UPWorth set, with triggers enabled |
| Photo `width`/`height` columns unused | Store real dimensions at upload to remove the last gallery CLS risk |
| In-memory rate limiter is per instance | Set Upstash if the address leaks |
| HEIC from some desktop browsers reports an empty MIME type | iOS Safari, the main HEIC source, reports it correctly. Watch the upload rejections after the wedding |
| Lighthouse performance 76 to 90 on mobile | 321 KB page, CLS 0. Driven by hydration on a 4x throttled CPU and the display heading waiting on Bodoni. Levers: fewer `Reveal` wrappers on the home page, `font-display: optional` for the display face |
| Marquee direction | `PROJECT_RULES.md` says decorative moving text animates left to right. The marquee translates content leftward, ticker-style. Raised in the September QA pass; Erick decided to leave it as is. Closed |
| Manual naming | `PROJECT_RULES.md` mandates `USER_MANUAL.md` and `handoff.md` at the root. The September QA brief asked for `docs/USER-MANUAL.md` and `docs/DEVELOPER-HANDOFF.md`. Decided: the docs/ files are canonical, the root files are pointers, `qa-check` requires both. `PROJECT_RULES.md` is left unchanged because it is copied into every project verbatim |

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

### The redesign (17 September 2026)

The client's verdict on round three was "everything's ugly", with the
couple's attire guides attached and an instruction to research good wedding
sites first. Two dozen examples across three roundups (Site Builder Report,
Colorlib, Dorik) and the 2026 trend writing agreed on five things: a limited
palette matching the wedding, a classic serif for titles with a clean sans
for details, a centred and generously spaced layout with no visual noise, a
prominent RSVP, and, without exception, a photograph of the couple as the
first thing on the page.

Everything visual changed to match. Palette from the attire guides (section
12). Cormorant Garamond for Bodoni. Ribbon, blobs, folios and marquee
removed. `SectionHeading` and `PageHeader` centred. The hero rebuilt to lead
with a photograph when the couple supply one, and honest type until then.
`icon.svg`, `favicon.ico`, `apple-touch-icon.png` and `og.jpg` regenerated;
the OG image now carries the names and the date, which closes an old debt
item. Contrast re-measured on 474 text elements, zero failures.

The single biggest remaining reason the site can look unfinished is that it
has no photograph of the couple. No palette fixes that.

The programme was revised to the host's own twenty-item sheet at the same
time: dinner brought forward to straight after the prayer (which answers the
7:30 to 8:00 question), the save-the-date video, pictorial segment,
under-the-chair game and slideshow dropped, the bouquet game now sinulid at
karayom. Grand entrance still lands on 8:00 PM; the evening ends at 11:00.

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

### Recycle bin, archive and Edit the website (17 September 2026)

Asked for by the owner, modelled on the Centennial Events Hall dashboard, and
checked against current practice (SharePoint 93 days, Salesforce 15, Fabric 7
to 90; all agree on a dedicated bin view, self-service restore and a confirmed
permanent delete). Retention here is 14 days, the studio's house number.

- Migration `0004_recycle_bin_archive_content.sql`. Run it in the Supabase SQL
  Editor like the first three; it is additive and safe to re-run.
- `CRON_SECRET` is a new required variable on Vercel. Until it is set the
  purge route returns 401 and nothing is ever removed for good by itself.
- The three list pages take `?view=active|archived|trash`. The shared chips,
  buttons and copy live in `app/admin/(dashboard)/shelf-controls.tsx`; the two
  irreversible buttons use `confirm-button.tsx` (a browser confirm).
- `removePhoto` and `removeRsvp` are gone. Nothing outside `deleteForGood()`
  hard-deletes, and only the bin and the purge call it.
- Test and template rows: the owner asked that everything test-like be
  deleted. That is done from the dashboard (Delete, or Empty the bin), not by
  a migration, so it goes through the audit log like everything else.

### 17 September 2026, the photographs

The couple had no engagement shoot and sent five photographs they already
had, edited for clothing colour and clutter. Web copies (70 to 206 KB, JPEG
quality 82) are in `public/photos`; the masters are in
`photos-master/edited`, outside git.

- **Hero.** `home.heroPhoto` defaults to the beach photograph. The hero is
  now side by side when a photograph exists: type left, photograph framed
  right (3:2 on phones, 4:5 from `lg`), stacked photograph-first on a
  phone. The full-bleed veil version put the names across their faces
  because the couple stand centred in every photograph; it was replaced the
  same day. Without a photograph the hero is the centred type version.
- **Our Story.** New `ourStory.photos` list (`src`, `alt`, `caption`,
  `shape`), rendered two per row between the hashtag and the values.
  Landscape frames are 3:2, portrait 4:5, `object-cover`. Editable under
  Edit the website, Our story.
- **Share card.** `og.jpg` is now 1200 by 630: the beach photograph on the
  left, the existing type card on the right. Composed with sharp from the
  previous card, so no font rendering was needed.
- `HERO_PHOTO` in constants is gone; the site document owns the photographs.

**Later the same night, second round.** The client rejected the side-by-side
hero ("hindi bagay"), sent seven more photographs (two studio portraits
each, one candid each, a taller Christmas-tree copy) and a third attire
guide (principal sponsors), and asked for the actual outfits as pictures,
in HD, with every photograph used.

- **Hero, third and final layout.** Full-width photograph, `80vh` capped at
  `56rem`, pulled up under the transparent header (`-mt-[4.5rem]`),
  `object-[50%_30%]` so the faces stay in the clear upper part, the names
  and date low over `bg-veil` (a tailwind `backgroundImage` token: clear
  to 38 percent, ink 78 percent at the foot). The practical block (ceremony
  time, intro, two CTAs, countdown, hashtag) sits beneath on paper. This is
  what the well-liked wedding sites do; the two earlier attempts are
  recorded in the Hero's own comment so they are not repeated.
- **Page header photographs.** `PageHeader` takes `photos?: StoryPhoto[]`:
  one is a wide band (`3:2`, `21:9` from `lg`), two are a `4:5` pair.
  Details, Programme, Entourage, Guestbook and RSVP each carry a
  `headerPhotos` list in the site document, editable per page.
- **Our Story.** `ourStory.pair` (one portrait of each) renders as "The two
  of them" above the favourites grid, which now holds the four candids.
- **Photograph files.** Web copies in `public/photos` (all under the 300 KB
  QA budget; the elephants photograph needed quality 76 at 1400 px).
  Masters in `photos-master/` inside the repo folder, gitignored:
  `originals/` (as sent, renamed `*-original.jpg`), `edited/` (ChatGPT
  results), `attire-guides/` (the guides as sent), `attire-hd/` (the HD
  figures). `carlo-kristinne-school-christmas-tall` is a duplicate crop and
  is in `public/photos` but not placed anywhere.
- **Dress code figures.** `DressRole.figure` points at an HD illustration
  generated in ChatGPT from the guides' own style (faceless figures, white
  background, the hex values of the attire palette in the prompt). Four
  exist: principal sponsors, best man, bridesmaids, groomsmen. The maid of
  honour, the couple and the guests have none; those cards show the swatch.
  The sponsors' guide image could not be saved as a file (a mid-turn
  attachment never reaches the transcript), so `attire-guides/` holds only
  the first two guides; the HD figure was drawn from the description.
- **Principal sponsors row.** New in `DRESS_CODE`, from the third guide:
  gowns in taupe, mocha, blush or champagne with lace or flutter sleeves and
  a clutch; Barong Tagalog with black trousers for the men. Swatch stops
  are the guide's five earth tones. `DressCode.tsx` now merges by role: the
  saved document's words win for a known role, and a role in code that the
  saved document lacks is appended in code order, so this row reached the
  live site without a re-save. A row the couple add themselves still shows.
- **Portrait recolours.** The four solo studio portraits were in the
  original light blue and sage. Each was re-edited in ChatGPT (upload,
  "change only the shirt colour", faces untouched) to dark steel blue for
  Carlo and dusty blue for Kristinne, to match the couple shots.

### The mobile menu (17 September 2026, night)

Reported by the client: on a phone, once the page was scrolled even a
little, the menu button "did nothing". Cause: the header gained
`backdrop-blur-xl` on scroll, and a backdrop filter makes an element the
containing block for its `position: fixed` descendants. The menu panel was
a fixed child of the header, so its `inset-0` became the header's 4.5rem
box: the menu opened, 68 px tall, behind the bar. Measured with
`getBoundingClientRect` before and after. Fix: the panel is portalled to
`document.body` (`createPortal`, after mount), and the header blur is
gone in favour of `bg-brand-paper/95` with `transition-colors`, since iOS
Safari also mishandles fixed elements with backdrop filters. Rule going
forward: nothing `fixed` lives inside anything with a transform, filter or
backdrop filter.
- A saved site document carried an empty `home.heroPhoto` from before the
  photographs existed, because a page save snapshots the whole document and
  stored scalars win. The hero now falls back to the default photograph when
  the stored value is empty, so a photograph is always shown; uploading one
  from the Home form replaces it.

### Pushing from a laptop with several GitHub accounts (17 September 2026)

Windows Credential Manager on Erick's laptop holds tokens for six GitHub
accounts. With the remote set to a bare `https://github.com/...` URL, Git
Credential Manager cannot tell which one to use and opens an account picker
on every push, which looks like a hung push when nobody is at the screen.
The remote now carries the username,
`https://jcalcantara08@github.com/jcalcantara08/carloandkristinne.git`, so
GCM goes straight to Carlo's stored token. On a new laptop, sign in once as
`jcalcantara08` when GCM asks, and keep the username in the remote URL.

### The printed invitation suite (17 September 2026, morning)

Five cards arrived (entourage, save the date, invitation, attire guide,
finer details), filed as `photos-master/invitation-suite/`. Everything on
them is now in `constants.ts`, and where the print disagreed with the July
workbook the print won:

- **Venues.** Jesus the Counselor Church, General Trias (ceremony) and
  Servando's Restaurant, Rosario (reception), with addresses. The map links
  are the QR codes' destinations, decoded with `jsqr` after a slight blur
  (the codes are stylised with a logo) and followed through Canva's short
  links to Google Maps places. `WEDDING_DAY.town` is now General Trias and
  `receptionTown` Rosario; the Details page no longer prints a town line
  under an address that already carries one.
- **Entourage.** Every name on the card: parents, grandparent, both
  officiants, seven pairs of principal sponsors, candle/veil/cord, six
  groomsmen, six bridesmaids, three bearers. The bearers' roles differ from
  the workbook (ring KD Trey Nicolas, bible Ruri Chan Monzon, coin Zephanie
  Bible Capoon); the emcee script was corrected to match. Sponsor groups
  render two across so the pairs stay side by side.
- **Times.** Guests welcome from 3:00 PM (`WEDDING_DAY.doorsTime`), ceremony
  promptly at 4:00 PM. RSVP deadline 5 October 2026. The "seated by 3:30"
  wording is gone.
- **Attire.** The full guide adds parents (purples, barong), secondary
  sponsors (blues, barong), maid of honour (lavender, not the workbook's
  dusty blue), bearers (blues), and guests (the blues; not white, red or
  black). `DRESS_NOTE` is the guide's own sentence. `ATTIRE_PALETTE` now
  carries three families (blues, purples, earth tones) and the Details page
  shows them grouped. Figures for the five new rows were generated the same
  way as the first four.
- **Gift note.** The registry FAQ answer is the couple's printed wording.
- **Hashtag casing** is now as printed: `#CARLOobngDiyoskayKRISTINNE`.
- **`healContent`** (`lib/content-schema.ts`, called from `getContent`). The
  live site had a document saved before the card arrived, and a saved list
  wins over new defaults, so the entourage stayed on the July snapshot after
  deploy. The heal walks the code's groups in order: a saved group with
  names wins, unless every saved name is contained in a code name (then the
  code's fuller, newer group wins: the bearers' printed roles, and the
  second officiant); an empty
  saved group gives way to code; groups the document lacks are appended;
  groups the couple added are kept. Same idea as `DressCode.tsx` merging
  rows by role, where a saved row without the `outfit` field is a pre-guide
  snapshot and gives way to code (Kristinne spotted "Dusty blue" over the
  lavender maid of honour gown on 17 September; that was the cause).

### The arrival prompt (17 September 2026)

Requested by the couple through Erick: a guest who opens the invitation
link should be invited to leave a greeting and upload a photograph, as a
pop-up rather than a section. `components/WelcomePrompt.tsx`, mounted in
the root layout, portalled to body: a dialog with focus moved in, Escape to
close, body scroll locked, two links (`/guestbook`, `/gallery#upload`) and
"Maybe later". Shown once per browser via `localStorage` key
`kc-welcome-seen` (try/catch, private windows see it again), after 1.8 s,
never on `/admin`, `/guestbook` or `/gallery`.

### The studio card and the credit line (17 September 2026)

Erick promotes Enclave on the site he built. `components/EnclavePromo.tsx`
(mounted in the root layout) is a corner card, not a modal, shown at the
minute marks in `PROMO.minutes` (1, 3, 5) of a visit, counted from the first
page opened (`kc-promo-start` in localStorage) so navigation does not reset
it; each mark shows once (`kc-promo-shown`), closing one does not cancel
the next, and it never shows on `/admin`. Copy and the link
(erickcabal.com/enclave) are `PROMO` in constants. `CREDITS.note` adds
Erick's own line to the footer attribution on every page: he is Carlo's
kababata. The attribution itself stays, per rule 10.

### The hero tone (17 September 2026, evening)

Erick: the sunset beach photograph fought the plum and blue branding. The
hero now shows the studio "lean" photograph (both in the wedding blues) in
a light treatment: names in ink above, the picture beneath on the ice tint
with a four-edge mask (`mask-composite: intersect`, two linear gradients)
so the studio grey has no rectangle, `object-contain`, never cropped.
`HERO_TONE` in constants picks "light" or "dark"; the dark branch (full
bleed, paper names over an ink fade, paper header until scrolled) is kept
for an outdoor photograph and the header reads the constant so it knows
which text colour to use before anything paints. The beach photograph
remains on the RSVP page. `og.jpg` re-rendered with the studio photograph.

**Same evening, the above-the-fold pass.** Erick found the stacked light
hero left the buttons and countdown below a very tall photograph, and a
leftover branch rendered the type-only hero a second time beneath it. The
light hero is now two columns from `lg` (words 5/12 on the left: eyebrow,
names at `display-xl`, date, ceremony time, intro, the two buttons, the
countdown, the hashtag; photograph 7/12 on the right, uncropped, masked)
and photograph-first on a phone with the RSVP button inside the first
screen at 375 by 812. A `<wbr>` after the ampersand is the only place the
names may wrap; without it "Kristinne&Carlo" is one word and broke inside
"Carlo". The practical block renders beneath only for the dark and type-only
heroes. Sources: the hero guidance at Shopify, Webflow and Site Builder
Report, 17 September 2026.

### Doors at six (17 September 2026, night)

Carlo, on Messenger: "6 po start na sa venue". `RECEPTION_DOORS` is now
"6:00 PM" (and the hand-kept `RECEPTION_DOORS_MINUTES` beside it), so
every derived reception time moved 75 minutes earlier: grand entrance 6:45,
dinner 6:55, cake 8:00, goodnight 9:40, doors to goodnight still 225
minutes. Every sentence that quoted the old times (venue note, three FAQ
answers, the programme intros, the manual) was rewritten. Erick told Carlo
he will tighten the running order ("bibilisan"); when he does, the per-item
minutes in `SCHEDULE` are the only thing to edit.

`healContent` grew two more rules: `home.glance` is always taken from code
(it is four facts from constants and a saved copy was still showing Rosario,
7:15 and violet on phones), and its form field is gone; a saved
`programme.doors` equal to a superseded default ("7:15 PM") gives way to
the current one; and `details.venues` keeps the couple's saved name, address
and map link per venue but takes `time` and `note` from code, because a
saved list was still saying "Doors at 7:15 PM". The 7:15 timeline notes
above are history now.

### The saved-document trap, closed for good (18 September 2026)

The programme rebuilt in the previous note did not reach the live site
either: the Programme page still showed the July order, "Kindly reply by
30 September", and "the doors do not open until a quarter past seven",
because the saved document is a whole snapshot and each of those is a
default that has since changed. That was the fifth fact pinned this way,
each fixed by another hand-written rule in `healContent`. Two general rules
now replace the whack-a-mole, in `lib/content-diff.ts`:

1. **Saves are sparse.** `saveContent` stores only what differs from
   `DEFAULT_CONTENT` (`sparse`). A field the couple never touched is not in
   the database, so the code's current default always shows. The editor is
   unchanged; it still reads the merged document.
2. **Old defaults are dropped on read.** `lib/retired-defaults.json` holds a
   fingerprint (path plus canonical value) of every default value from every
   earlier commit that the code no longer ships. `getContent` runs
   `dropRetired` over the stored document before the merge: a stored value
   that matches one of them is a leftover snapshot, not an edit, and gives
   way. A value the couple typed themselves never matches. Lists are
   fingerprinted whole, and an object key that is empty or missing is
   ignored, so a row the editor rebuilt with `""` fields still matches the
   row the code shipped without them.

The list is generated from git history by `npm run retired`
(`scripts/retired-defaults.ts`: evaluates `DEFAULT_CONTENT` at every commit
that touched `lib/constants.ts` or `lib/content-schema.ts`). It is part of
`npm run verify`, and `npm run qa` fails with the exact instruction if the
defaults in code have changed since the file was generated (a digest of the
current defaults is stored in it), so it cannot silently go stale, on any
machine, without git. **Run it and commit the JSON after any change to a
default.** The earlier `healContent` rules stay; they handle a saved list
that is partly the couple's.

Also in this pass: the programme intros said the evening "finishes near
midnight" (a default nobody had rewritten when the doors moved to six);
they now say about ten. `.env.local` is not on this laptop, so nothing in
the database was touched by hand; the fix is entirely in code.

### One project folder (18 September 2026)

The photo masters used to live in a sibling folder so they could never be
committed. Erick wanted one folder, so they now live in `photos-master/`
inside the project, listed in `.gitignore`. OneDrive syncs them, git does
not see them, and the web copies in `public/photos` are the only ones the
site serves. Subfolders: `originals/` (as sent), `edited/` (ChatGPT
results), `attire-guides/`, `attire-hd/`, `invitation-suite/`.

### The programme is the couple's own (18 September 2026)

Tin and Carlo annotated the first emcee script and sent their own programme
sheet, so the reception `SCHEDULE` in `lib/constants.ts` was rebuilt to
follow it, 23 items from the 6:00 PM doors to a 9:50 PM send-off. What
changed, in their words: the trivia comes before dinner and the winners eat
first; the entourage enters as Team Bride then Team Groom; the couple are
announced as Mr. and Mrs. Alcantara; the prosperity dance has no pins, no
envelopes and no props, only blessings; the cake, the candle and the wine
toast happen inside one song, Panalangin, sung by the whole room; there is
no bouquet throw, the bouquet goes to the winner of sinulid at karayom among
five single ladies from their list, and the garter to Mr. Bachelor from the
Cinderella game among five single men; the two winners then play a copy-the-
couple game; the mothers speak before the fathers; loved ones (Tin's brother,
Carlo's close friend and sister) get short messages after the toasts; the
same-day edit is gone, replaced by a Guess the song game with "trip" prizes
that are announced at the welcome; the prayer is led by Mar Alen Alamo; and
the music plays from a phone over the venue's Bluetooth, so the script carries
a playlist in running order and a rule that someone other than the host holds
the phone. The FAQ answers about games and singing were reworded to match.
The script itself lives in Google Drive (id in Claude's memory), regenerated
from the Claude Doc on every revision because the Drive connector cannot
rewrite a file in place.

## 18. Future improvements

- A private, tokenised guest link so each invitation prefills its own names
- Bulk download of the whole album as a zip, built server side
- A seating-plan view generated from the RSVP data
- Real image dimensions captured at upload, to remove all gallery CLS
- A Filipino language toggle, if enough guests would use it

---

Built with care by [Erick Cabal](https://erickcabal.com).
