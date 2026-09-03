# User Manual

Two parts. Part 1 is for Carlo and Kristinne and needs no technical knowledge
at all. Part 2 is for whoever works on the code next.

Part 1 is also rendered inside the site itself, at `/admin/manual`, so the
couple can read it where they actually work rather than in a file they will
never open.

---

# Part 1. Owner Guide

Written for Carlo and Kristinne.

## What this site is

This is your wedding website. Guests use it to:

- read the details of the day, the dress code and the programme
- reply to the invitation
- leave you a message
- after the wedding, upload the photographs they took and download everyone
  else's

The web address goes on your printed invitations, so treat it as part of the
invitation rather than as an extra.

## The pages, and what each is for

| Page | What it does |
|---|---|
| Home | The date, a countdown, and a short version of everything else |
| Our Story | Who the two of you are, and what the hashtag means |
| Details | Venues, dress code, parking, the rain plan, and the questions guests ask |
| Programme | The run of the day, from the seven in the morning start to the send-off |
| Entourage | Everyone standing with you |
| Gallery | The shared photo album, and where guests upload |
| Guestbook | The wishing wall |
| RSVP | The reply form |

## The most important thing to know

**Nothing a guest writes or uploads appears in public until you approve it.**

Messages and photographs both arrive as *pending*. They sit in the dashboard
under "Waiting for you" until you press Publish. Nothing is lost and nobody is
notified either way.

This is deliberate. An open upload box on a public address needs a human
looking at it.

## Logging into the dashboard

1. Go to your site address followed by `/admin`.
2. Enter the password. (Erick has it. Keep it somewhere you can find it.)
3. You stay signed in for eight hours.

Sign out when you are finished on a borrowed or shared device.

## The dashboard, screen by screen

**Overview.** The number of days left, how many seats are confirmed out of
100, how many replies you have had, and how many things are waiting for you.

**Replies.** Every RSVP, newest first, with names, contact details, dietary
notes and song requests.

**Messages.** The guestbook. Publish puts a message on the public wall, Hide
takes it down again without deleting it.

**Photographs.** Guest uploads. Publish adds one to the public album, where
anyone can view and download it at full size. Delete removes the actual file
as well as the record, and cannot be undone.

**Manual.** This guide, inside the site.

## The number the caterer needs

On the Replies page, press **Download CSV**. That gives you a spreadsheet that
opens in Excel, Numbers or Google Sheets.

That file is what you send to the caterer, and what you build the seating plan
from. Do this about two weeks before the wedding, and again on the day before
if late replies come in.

## Updating what the site says

Almost every fact on the public pages lives in one file, `lib/constants.ts`:
venue names, times, the entourage, the dress code, the questions and answers.

Anything not decided yet is marked as pending in that file, and the site shows
a small **To be confirmed** chip in its place. Fill in the real value and the
chip disappears by itself. Nothing else has to change.

Things currently showing that chip:

- the church name and address
- the reception venue name and address
- both map links
- the principal sponsors, secondary sponsors, bridesmaids and groomsmen
- Erick's guest-facing email and phone number
- the on-the-day coordinator

Ask Erick to make these edits, or make them yourself. The site rebuilds
automatically about a minute after a change is saved.

## The reception programme

The Programme page shows the whole day, and the reception is the full
traditional running order from the host's programme sheet, twenty-six items
from the opening dance to the closing remark.

The clock times for the reception are not typed in anywhere. Every one of
them is worked out from the 7:15 PM doors using the length of each item, so
if you want something to run longer or shorter, change its `minutes` value in
`lib/constants.ts` and everything after it moves by itself. You never have to
recalculate the rest by hand.

Two numbers worth knowing: dinner is called at about a quarter to nine, and
the evening finishes at about half past eleven.

## Uploading photographs yourselves

You upload the same way a guest does, on the Gallery page. Then approve your
own upload in the dashboard. There is no separate route, which means one thing
to learn instead of two.

## How updates go live

Every change is published automatically. You do not press a deploy button.
A change saved now is live in roughly a minute.

## Your routine

**Once a week, until September**
- Check Replies
- Publish any waiting messages
- Glance at the headcount on Overview

**Two weeks before**
- Download the CSV and send the final number to the caterer

**On the day and the week after**
- Check Photographs daily. This is when the uploads actually arrive.

## Checklist before you tell people about a change

- Open the page on your phone, not just on a laptop
- Read it top to bottom for typos
- Click every button on it
- Check that nothing says "To be confirmed" that you have already confirmed

## Common situations

**A guest says their reply did not go through.**
Check Replies first. If it is not there, ask them to try again, then tell
Erick.

**Somebody replied twice.**
Delete the older one. Deleting is permanent, so read both first.

**Somebody left a message you would rather not publish.**
Just do not publish it. It stays invisible and nobody is told.

**A photograph should not be in the album.**
Hide it. Use Delete only if it must be gone from storage entirely.

## Troubleshooting

**A red banner says the database is not connected.**
Nothing can be saved while that is showing. Tell Erick immediately.

**The RSVP form says replies are not switched on.**
Same cause as above.

**You cannot sign in.**
Five wrong attempts locks you out for fifteen minutes. Wait it out.

**The site looks wrong on your phone.**
Pull down to refresh first. If it persists, screenshot it and send it to
Erick.

## FAQ

**Can guests see the guest list?** No. Only you and Erick can see who replied.

**Can guests edit a reply after sending it?** No. They message Erick and he
fixes it in the dashboard.

**Will guests need an account to upload photographs?** No. No app, no sign-up.

**How long do the photographs stay up?** As long as the site is paid for. Ask
Erick to download a full backup after the wedding.

**Is the wedding budget on this site anywhere?** No. Nothing about money,
suppliers or negotiations is in the website or its code. That stays in your
workbook.

---

# Part 2. Developer Guide

## Tech stack

Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 3.4,
Supabase (Postgres and Storage), Resend, Vercel. Node 20.10 or newer, npm.

## Architecture

```
Server Component (default)
    reads via lib/store.ts
        which reads Supabase with the service role

Client Component ("use client", only for state or events)
    submits to a Server Action in app/actions/
        rate limit  ->  honeypot  ->  zod  ->  sanitize
        ->  persist  ->  email  ->  revalidatePath
```

Three rules that prevent most of the bugs:

1. **Server Components by default.** `"use client"` at the leaf, never at a
   layout. The only client components are the header, the mobile nav, the
   countdown, the reveal wrapper, the gallery lightbox and the four forms.
2. **Every admin mutation calls `requireAuth()` on its first line.** A Server
   Action is a public HTTP endpoint even when no UI links to it.
3. **Validate with zod at the boundary.** Client validation is UX. Server
   validation is security.

## Folder structure

See `README.md`.

## Install and run

```bash
npm install
cp .env.example .env.local
npm run dev            # port 3028, matching the folder number
```

## Environment variables

Documented in `.env.example`. Notes that matter:

- `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` **have no fallbacks.**
  `requiredEnv()` in `lib/auth.ts` throws. `isAuthConfigured()` exists so the
  login page can render a helpful screen instead of a 500.
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. Server only. `lib/store.ts` is
  marked `server-only` and is the only importer.
- Without `RESEND_API_KEY` the mailer logs and returns. Nothing breaks.

## Build process

```bash
npm run typecheck      # separately from build. Running both at once has
npm run build          # OOM-killed builds with exit 137.
```

Vercel runs `npm run check && npm run build`.

## Deployment

GitHub `main` to Vercel, auto-deploy. Preview deploys on branches. Set every
variable from `.env.example` in the Vercel project.

## Components

| Component | Note |
|---|---|
| `Aurora` | The two drifting orbs. Decorative, `aria-hidden`, killed by reduced motion. |
| `Monogram` | Conic-gradient ring masked to a hairline. Two elements, no images. |
| `Reveal` | CSS-first scroll reveal with a 1200 ms failsafe. Stagger is `index * 80`. |
| `PhotoFrame` | Every image. Draws an intentional placeholder when `src` is missing. |
| `Pending` / `Value` | Renders a fact, or a "To be confirmed" chip, from the flags in `constants.ts`. |
| `Section` / `SectionHeading` | Section rhythm and the numbered editorial heading. |
| `GalleryGrid` | Lightbox with keyboard navigation and a real download link. |

## Server Actions

| Action | File | Protection |
|---|---|---|
| `submitRsvp` | `app/actions/rsvp.ts` | honeypot, 6 per 15 min per IP, zod, sanitize |
| `submitGuestbook` | `app/actions/guestbook.ts` | honeypot, 5 per 10 min, zod, sanitize |
| `submitPhotos` | `app/actions/gallery.ts` | honeypot, 8 per 10 min, real MIME and size check |
| `signIn` | `app/admin/login/actions.ts` | 5 per 15 min, constant-time compare |
| admin mutations | `app/admin/(dashboard)/actions.ts` | `requireAuth()` first, audit row after |

## Database and RLS

Migrations are numbered and never edited after they run.

RLS is enabled on all four tables **with no policies at all.** That is
deliberate: the anon key is in the browser bundle by definition, and this site
has no Supabase-authenticated users. Every read and write goes through the
Next.js server with the service role.

Do not add a "public read approved rows" policy as a convenience. It would
expose guest names and messages to anyone who reads the JavaScript.

The storage bucket **is** public for reads, because the couple asked that
anyone be able to download originals with no account and no expiring link.
Object names are server-generated UUIDs, so the bucket is not enumerable.
There is no write policy, so no client can upload directly.

## Auth model

Signed cookie session, HMAC-SHA-256, Web Crypto only so it runs on the Edge
runtime in `proxy.ts`. Eight-hour expiry. `httpOnly`, `secure` in production,
`sameSite: lax`.

`proxy.ts` (what Next 15 and earlier called `middleware.ts`) only redirects.
`requireAuth()` is the actual gate.

## Coding conventions

- Components `PascalCase`, `lib/` files `kebab-case`, routes `kebab-case`
- Route groups parenthesised: `app/admin/(dashboard)/`
- `handoff.md` lowercase
- No em dashes anywhere, enforced by `npm run grammar`
- Every brand fact imported from `lib/constants.ts`, never hardcoded
- No hex codes in components. The palette is `tailwind.config.ts` plus the
  semantic layer in `styles/globals.css`.

## Security practices

Run `npm run security` after every meaningful change. It scans for fallback
secrets, hardcoded keys, `dangerouslySetInnerHTML` outside the JSON-LD blocks,
the service-role client reaching a client component, and admin actions missing
`requireAuth()`.

**OneDrive warning.** This project lives inside OneDrive, so `.env.local`
syncs to Microsoft's cloud even though git ignores it. Gitignore is not a
security control here. Treat every secret in this folder as exposed to that
account and rotate anything sensitive.

## QA procedures

```bash
npm run check      # qa + grammar + security + css
npm run typecheck
npm run lint
npm run build
```

`npm run css` exists because the other four checks do not compile CSS. An
invalid utility inside an `@apply` sails past all of them and then 500s every
route at render time.

Then the manual pass: complete the RSVP flow with the keyboard alone, zoom to
200 percent, and check one page on a real phone.

## Troubleshooting

**Build fails for no visible reason.** OneDrive. Exclude `node_modules` from
sync, or develop from a local-disk clone.

**`pnpm: command not found` in a git hook.** Run the checks yourself and
commit with `--no-verify`.

**Images do not load from Supabase.** `next.config.mjs` derives the allowed
image host from `NEXT_PUBLIC_SUPABASE_URL`. If that variable is missing at
build time, the allowlist is empty.

## Future improvements

Listed in `handoff.md` section 15.

---

Built with care by [Erick Cabal](https://erickcabal.com).
