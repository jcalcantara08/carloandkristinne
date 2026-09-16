# Carlo & Kristinne. The wedding website.

John Carlo Alcantara and Kristinne Monzon, 17 October 2026, Rosario, Cavite.
One hundred guests, a four o'clock ceremony, and `#CARLOobNgdiyoskayKRISTINNE`.

The site is the single place a guest goes for the details, to reply to the
invitation, to leave a message, and afterwards to upload and download the
photographs everyone took.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16, App Router |
| Runtime | React 19 |
| Language | TypeScript, strict |
| Styling | Tailwind CSS 3.4 |
| Data | Supabase (Postgres + Storage) |
| Auth | Signed cookie session, owner only |
| Email | Resend, optional |
| Hosting | Vercel |

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev                  # http://localhost:3028
```

The public site renders fully without any environment variables. RSVPs, the
guestbook and the photo album need Supabase; the admin area needs
`ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`. Each shows an honest
"not configured" state rather than an error.

### Database

```bash
supabase db push
```

Runs `supabase/migrations/0001_init.sql` through `0003_storage.sql` in order.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on port 3028 (the folder number) |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit`. Run separately from build. |
| `npm run lint` | ESLint |
| `npm run qa` | Broken links, missing alt text, missing metadata, oversized images |
| `npm run grammar` | Em dash detection and common misspellings |
| `npm run security` | Fallback secrets, hardcoded keys, unguarded admin actions |
| `npm run css` | Compiles `globals.css` and fails on an invalid `@apply` |
| `npm run check` | All four of the above. Gates the Vercel build. |
| `npm run verify` | typecheck, lint, check and a production build. The definition of done. |
| `npm run doctor` | Does this laptop have what the project needs? Zero dependencies. |
| `npm run clean` | Deletes build caches. Always safe. |

## Project structure

```
app/
  page.tsx                     home
  our-story/ details/ programme/ entourage/
  gallery/ guestbook/ rsvp/
  actions/                     rsvp.ts, guestbook.ts, gallery.ts
  admin/
    login/                     page, form, actions
    (dashboard)/               overview, rsvps, guestbook, photos, manual
components/
  layout/                      Header, Footer, MobileNav, SkipLink
  sections/                    Hero, AtAGlance, DressCode, CtaBanner, ...
  forms/                       RsvpForm, GuestbookForm, UploadForm
  ui/                          Button, Card, Field, Badge
  Aurora, Monogram, Reveal, PhotoFrame, Pending, Section, Countdown
lib/
  constants.ts                 every wedding fact, with pending flags
  store.ts                     the only module that talks to Supabase
  auth.ts, admin-guard.ts, sanitize.ts, rate-limit.ts, email.ts, seo.ts
supabase/migrations/           0001_init, 0002_rls, 0003_storage
scripts/                       qa-check, grammar-check, security-check, css-check
```

## Environment variables

See `.env.example`. Every key is documented there and every value is blank.

`ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` have no fallbacks by design. A
build that refuses to start beats an admin panel with a password written in
the documentation.

## Deployment

Push to `main`. Vercel runs `npm run check && npm run build` and deploys.
Set every variable from `.env.example` in the Vercel project first.

## Project standards

`PROJECT_RULES.md`, copied unchanged from the canonical version in
`Enclave Files/Playbooks/`. It is the standard for this project for its whole
life, not just at launch. `WEBSITE_PLAYBOOK.md` in the same folder explains
how to satisfy it.

Deliberate deviations from the house build guide are documented in
`docs/DEVELOPER-HANDOFF.md` section 17. The short version: no react-hook-form, and the single
contrast band per page is dark rather than light, because the ground is
already a light neutral.

## Out of scope (by design)

- **No gift registry or payments.** The couple were explicit that there is no
  registry. Do not add one.
- **No guest accounts or logins.** The only login is the couple's.
- **No seating-plan builder.** The CSV export is what the seating plan gets
  built from, by hand, in a spreadsheet.
- **No budget, vendor or supplier data anywhere in this repository.** That
  lives in the planning workbook and is private. This site is for guests.
- **No live chat, no comments on photographs, no social feed.**

## Credits

Built with care by [Erick Cabal](https://erickcabal.com), who is also the best
man and the emcee, which explains the tone of some of the copy.

## License

Private. Not for reuse.
