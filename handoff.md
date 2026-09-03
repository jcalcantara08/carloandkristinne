# handoff.md

The project's shared memory. Another developer, or an AI assistant, should be
able to continue confidently after reading only this file.

Last updated: 3 September 2026.

---

## 1. Project overview

The wedding website for **John Carlo Alcantara and Kristinne Monzon**, married
17 October 2026 at 4:00 PM in Rosario, Cavite, in front of 100 guests, by
Pastor Jomar, under Christian rites.

Hashtag: `#CARLOobNgdiyoskayKRISTINNE`, which reads as "Carlo, kaloob ng Diyos
kay Kristinne", Carlo as a gift from God to Kristinne.

The site was commissioned by the couple through Erick Cabal, who is
simultaneously the best man, the emcee, and the developer. That triple role
shows up in the copy, which is warmer and more direct than a neutral vendor
would write, and it is intentional.

## 2. Goals

The couple's own brief, taken from the workbook: *"Ilabas namin kung sino
talaga kami: makulit, masayahin, simple lang, at enjoy lang lahat."*

Concretely, the site has to:

1. Be the single address a guest goes to for every detail
2. Collect RSVPs against a hard cap of 100 seats
3. Collect wishes
4. After the wedding, be a shared photo album that anyone can add to and, in
   the couple's own words, that guests can **download** from
5. Look like nothing else, and match blue, violet and black with the couple
   in white

Point 4 came from the group chat directly: "pwede din ba nila kunin ung mga
uploads" and the answer was "oo, downloadable". That is why download is a
first-class control in the lightbox rather than a right-click.

## 3. Current status

**Built and working.** All eight public pages, the RSVP flow, the guestbook,
the photo album with guest upload, and the full admin dashboard.

**Not yet supplied by the couple**, and therefore rendering as deliberate
"To be confirmed" placeholders:

| Missing | Where it will slot in |
|---|---|
| Church name and address | `VENUES[0]` in `lib/constants.ts` |
| Reception venue name and address | `VENUES[1]` |
| Both Google Maps links | `VENUES[*].mapUrl` |
| Venue names and addresses only | The reception TIMES are now known from the coordinator timeline. `SCHEDULE` derives every one from the 7:15 PM doors. |
| Principal and secondary sponsors | `ENTOURAGE_GROUPS` |
| Bridesmaids and groomsmen | `ENTOURAGE_GROUPS` |
| Erick's guest-facing email and phone | `CONTACT.pointOfContact` |
| On-the-day coordinator | `CONTACT.coordinator` |
| How they met, the proposal | `app/our-story/page.tsx`, the `PendingBlock` |
| Every photograph | `PhotoFrame` renders placeholders until then |

**Not yet configured**: Supabase and the admin secrets. The site renders
correctly without them and says so honestly.

## 4. Features

- Home with hero, countdown, proof strip, and the page arc
- Our Story, Details (with FAQ), Programme, Entourage
- RSVP with party size, guest names, dietary notes and a song request
- Guestbook, moderated
- Gallery with guest upload, moderation, lightbox and full-size download
- Admin: overview with real metrics, RSVP inbox, CSV export, guestbook and
  photo moderation, audit trail, in-app manual
- 404, error boundary, loading state, sitemap, robots, manifest, JSON-LD

## 5. Architecture

See `USER_MANUAL.md` Part 2. In one line: Server Components read through
`lib/store.ts`; client forms post to Server Actions that rate limit, validate
with zod, sanitise, persist, then email.

## 6. Folder structure

See `README.md`.

## 7. Design system

### Brand kit

```
Business:        A wedding. One day, 100 people.
Customer:        Invited guests, mostly Filipino, mostly on a phone,
                 a good number of them ninongs and ninangs.
Primary action:  RSVP.
Voice:           Warm, affectionate, plain English with light Filipino
                 touches. Gently funny. Never solemn, never twee.
Feeling:         Bright, unhurried, celebratory.
Not:             Sombre, fashion-editorial, rustic, blush, scripted.
```

### Palette, and why

The couple chose "Blue, violet, black, couple in white."

**Read that as a description of the wedding, not of the website.** It is what
the entourage wears. The first version of this site took "black" as the page
ground and shipped a near-black midnight design. It was internally coherent
and it was wrong: it read as sombre, which is the opposite of a Filipino
wedding, and it is hard work for an older guest reading a phone outdoors.

The correct reading is the one below. White is the couple, so white is the
ground and the dominant field of the entire site. Black is the ink. Blue and
violet are the accents.

| Token | Hex | Role |
|---|---|---|
| `brand.paper` | `#FFFFFF` | The ground. Pure white: the couple's colour, and most of what you see. |
| `brand.paper-200` | `#F7F6FC` | A faint tint band, used to give a long scroll rhythm. Not a second contrast band. |
| `brand.ink` | `#05060E` | Type, the primary button, and the one dark band. |
| `brand.line` | `#E6E4F0` | Hairlines. |
| `brand.blue-500` | `#3A55D9` | The cool accent. |
| `brand.violet-500` | `#8B3FD4` | The warm accent, the eyebrow, the focus ring. |

Blue and violet appear only as a soft wash, the hairline rule, the monogram
ring and the dress-code swatches, never as a large flat fill. Black appears as
a field exactly once per page, at the closing CTA.

**Contrast, measured on the rendered page rather than assumed:**

| Pair | Ratio | Needs |
|---|---|---|
| ink on paper | 19.5:1 | 4.5 |
| ink at 75 percent on paper (body copy) | 9.5:1 | 4.5 |
| ink at 60 percent on paper (muted) | 5.4:1 | 4.5 |
| violet-500 on paper (eyebrow) | 5.4:1 | 4.5 |
| blue-500 on paper | 5.8:1 | 4.5 |
| paper on ink (the dark band) | 19.5:1 | 4.5 |
| violet-300 on ink (eyebrow, dark band) | 9.7:1 | 4.5 |

**60 percent is the muted floor.** 55 percent measures 4.47:1 and fails, which
is close enough to be worth writing down rather than rediscovering.

The primary button is ink on paper rather than a coloured fill: it is the
highest contrast available, and the strongest mark on the page should be the
thing we most want a guest to press.

### Type

**Bodoni Moda** (display) and **Inter** (body), both via `next/font`.

Bodoni is a didone: very high stroke contrast, hairline serifs, a
fashion-magazine face. At display size on paper it gives the names real
presence without needing a photograph behind them, which matters because
there are no photographs yet. It is deliberately not Cormorant Garamond and
not a script, both of which are the default wedding answer. Current design
writing for 2026 points the same way: editorial, magazine-inspired
typography, away from script-heavy layouts.

Clamp tokens live in `tailwind.config.ts` (`display-2xl` down to
`display-md`), so markup never carries a breakpoint ladder. The display face
is assigned once in the base layer, with `text-wrap: balance`.

### The signature moves

These exist because the first light build, while correct on colour, looked
like every other wedding template: a centred eyebrow over a centred heading
over two centred buttons, repeated nine times down a white page. Colour was
never the problem with it. Composition was.

- **The ribbon.** One continuous blue-into-violet line that snakes down the
  entire document, behind every section (`components/Ribbon.tsx`). It is the
  single device that makes the site look like itself. One fixed viewBox
  stretched with `preserveAspectRatio="none"`, kept from smearing by
  `vector-effect="non-scaling-stroke"`.
- **The editorial hero.** Not a centred stack. The names are set enormous
  (122px on desktop) and left-aligned in three staggered lines, with the
  ampersand indented and the only piece of colour. The date, countdown and
  hashtag hang in a narrow right-hand column behind a hairline rule. On very
  wide screens the date also runs vertically down the left margin as a folio.
- **The folio numerals.** Each section's index is set at 7rem, ghosted to 15
  percent ink, hanging in the left margin like a magazine numbering a spread.
  The hanging position is `2xl` only: the container caps at 1200px, so below
  1536px there is not enough gutter and it would cause a horizontal scroll.
- **Asymmetry as the default.** `SectionHeading` is left-aligned unless a
  section asks otherwise. Exactly two sections stay centred, for rhythm.
- **The wash.** Two large blurred blooms, blue and violet, drifting a few
  percent over half a minute. On white this reads as watercolour bleeding
  into the page, and it is why the ground never looks like a blank document.
- **The monogram ring.** A conic gradient masked to a 1.5px annulus, rotating
  once every 24 seconds. Two elements, zero images.
- **The numbered editorial heading.** `01`, `02`, `03` beside every section
  eyebrow, borrowed from the couple's own planning workbook, which numbers its
  own chapters 00 to 06. It ties the two documents together.
- **The intentional placeholder.** `PhotoFrame` with no `src` draws a
  tone-matched wash, a whisper of grain and a "Photo coming soon" tag.
  Adjacent frames cycle tone so no two match.
- **The single dark band.** The closing CTA, using `.on-ink`. That one class
  flips every child's polarity, so a section never restates a colour.

### House rules followed

Hero skeleton (eyebrow, h1, sub, hairline rule, exactly two CTAs), proof strip
under the hero, testimonials-equivalent immediately before the final CTA, one
contrast band per page, `py-16 sm:py-20 lg:py-28`, `mt-12` then
`mt-10 text-center`, body at 75 percent ink, `index * 80` stagger, expo-out
easing, `group-hover:scale-105 duration-500` on photos, ground-matched focus
ring, `aria-hidden` on every decorative node, styled `::selection`,
`html { font-size: 95% }` with inputs pinned to 16px.

Eyebrow tracking is `0.28em` everywhere, defined once as `tracking-eyebrow`.
The playbook notes this value drifts between 0.18em and 0.35em across the
portfolio. Here it is a token, so it cannot.

## 8. Important technical decisions

### Deliberate deviations from the house playbook

**1. The contrast band is dark, not light.** The playbook's house arc puts one
LIGHT band mid-to-late on a warm-neutral ground. Here the ground is already a
light neutral, so the band inverts: one dark band, at the closing CTA. The
rule is unchanged and only the polarity moves. Never two.

There is history here worth keeping. The first build read the couple's
"blue, violet, black" motif as an instruction for the page background and
shipped a near-black site. It was coherent, it matched 2026 editorial trend
writing, and it was the wrong call for the audience: a hundred guests, many of
them older relatives, reading a phone in daylight, for an occasion that is
meant to feel bright. The motif describes the wedding, not the website. If a
future session is tempted to "restore the dramatic version", that is the
reason not to.

**2. No react-hook-form.** The playbook lists it as a default. It is not here.
Every form is a native `<form action={serverAction}>` with `useActionState`
and `useFormStatus`. The forms are small, the validation is zod on the server
either way, and this ships less JavaScript, which is the INP metric the
playbook says we are most likely to fail. Progressive enhancement is a free
side effect.

**3. Zod v4.** `z.flattenError(error)` replaces the v3 `error.flatten()`.

**4. RLS with no policies at all.** Explained in `0002_rls.sql`. The anon key
grants nothing because nothing in the browser ever needs it.

**5. The storage bucket is publicly readable.** A considered trade, not an
oversight. The couple's requirement was that guests can download the files.
Object paths are server-generated UUIDs and there is no write policy.

**6. `next lint` is gone in Next 16.** `npm run lint` calls `eslint` directly
against a native flat config. The `FlatCompat` shim that older Next projects
use actually breaks here: `eslint-config-next` 16 ships real flat configs, and
running them through `@eslint/eslintrc` throws on a circular plugin reference.

**7. `loading.tsx` lives only on the admin dashboard, not at the app root.**
This one was found by reading the production HTML rather than by reasoning,
and it is worth understanding before anyone "restores" it.

A `loading.tsx` wraps its route in a Suspense boundary. Next then streams the
fallback as the initial HTML and swaps the real content in with JavaScript.
With the file at the root of `app/`, every public page shipped this:

```html
<main><!--$?--><template id="B:0"></template><div>...Loading...</div></main>
```

The actual page was a hidden div further down the document. That means the
spinner was the first paint on every route, the real content was gated behind
a client-side swap, and each page carried its content twice. All of it for
routes that are statically prerendered and fetch nothing at request time.

Moving the file to `app/admin/(dashboard)/loading.tsx` put it where there is
genuinely something to wait for. Every public page now server-renders
complete, and the HTML got smaller as a bonus (`/details` went from 126 KB to
108 KB).

The playbook lists "no `loading.tsx` anywhere in the portfolio" as the
least-developed part of the craft. The lesson is not "add one everywhere", it
is "add one where data is actually fetched per request".

**8. The countdown reads the clock only on the client.** An earlier version
snapshotted `Date.now()` on the server so the first paint had a number. On a
statically prerendered homepage that snapshot is frozen at build time, so it
would have shown a stale count that drifted further wrong every day for
anyone without JavaScript. The server now renders same-size placeholder boxes
and the client fills them in, which also means no layout shift.

### Things that are private and stay private

The planning workbook contains the budget (a ₱150,000 to ₱200,000 target),
supplier negotiations, downpayment amounts and internal flags. **None of it is
in this repository or on the site.** The public site is for guests. If a
future session is asked to "put the plan on the site", that is the line: guest
information yes, money and vendors no.

## 9. Security posture

- Signed cookie session, Web Crypto, HMAC-SHA-256, 8-hour expiry, fail closed
- Constant-time password comparison
- `requireAuth()` on every admin action and the export route
- Login rate limited 5 per 15 minutes per IP
- All three public forms: honeypot, rate limit, zod, sanitise, persist-then-send
- Photo uploads checked for real MIME type and size, server side
- Security headers in `vercel.json`, `X-Robots-Tag: noindex` on `/admin`
- CSV export guards against formula injection in name fields
- `npm run security` scans for the failure modes that have actually occurred
  in this portfolio before

**Known residual risk:** OneDrive syncs `.env.local` to Microsoft's cloud.
Rotate anything sensitive and do not treat gitignore as protection here.

**Not implemented:** a Content Security Policy. On a mostly static site a
nonce-based CSP forces dynamic rendering on every page and makes the whole
site uncacheable at the CDN, which is a bad trade here. A static CSP would
need `'unsafe-inline'` for the JSON-LD blocks. If it is added later, start
with `Content-Security-Policy-Report-Only`.

**Not implemented:** Cloudflare Turnstile. The playbook asks for it on public
forms. The honeypot plus IP rate limiting is the current answer, which is
proportionate for a site whose entire audience is 100 invited people. Add
Turnstile if the address ever spreads beyond them.

## 10. Coding conventions

See `USER_MANUAL.md` Part 2.

## 11. Environment setup

```bash
npm install
cp .env.example .env.local
npm run dev            # port 3028
supabase db push       # once the Supabase project exists
```

## 12. Deployment process

Push to `main`. Vercel runs `npm run check && npm run build`.

Pre-deploy gate, all of it green:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run check`
4. `npm run build` (separately from typecheck)
5. Review changed pages top to bottom, desktop and mobile
6. Zero em dashes, zero console errors, no broken images or links
7. Docs updated in the same session
8. This file updated

## 13. Known issues and technical debt

| Item | Note |
|---|---|
| `og.png` and `apple-touch-icon.png` are generated aurora fields with no text | They read correctly as the site's sky, but a proper OG card with the couple's names and date would be better. Regenerate once a photograph exists. |
| No Playwright tests | The playbook asks for three: the RSVP flow, admin login, and one mobile viewport pass. Worth adding before the invitations go out. |
| No CI workflows | Copy the UPWorth set, **with triggers enabled**. |
| No Turnstile | See section 9. |
| No CSP | See section 9. |
| Photo `width` and `height` columns are unused | They exist in the schema so a future session can store real dimensions and eliminate the last CLS risk in the gallery. |
| The in-memory rate limiter is per instance | Set the Upstash variables if the address ever leaks. |
| Turbopack caches generated CSS in `.next` | A new Tailwind utility can fail to appear in dev even after a server restart. `rm -rf .next` fixes it. Cost an hour once; do not debug the class name first. |
| The dark theme is gone but its history matters | See section 8, deviation 1, before "improving" the palette back toward black. |

### Verified in the browser, 23 July 2026

Re-run in full after the palette was flipped from dark to light. Every result
below is from the light build.

Measured on the running site rather than assumed:

- Contrast checked programmatically on every rendered text node against its
  real composited backdrop, on both the paper ground and inside the dark
  band. Zero failures; the lowest measured pair is 5.25:1 against a 4.5
  requirement. The gradient wordmark measures 5.81:1 and 5.38:1 on paper.
  (On the dark ground it would measure 3.35:1, which is why
  `.on-ink .aurora-text` switches to the lighter gradient pair. Nothing uses
  that combination yet; the rule exists so the first thing that does is
  already correct.)
- Tap targets: the footer navigation links were 16 px tall, failing WCAG 2.2
  target size (2.5.8). Now 24 px. Nothing else on the site is under 24 px.
- No horizontal overflow at 375 px on any page.
- Mobile menu: `role="dialog"`, `aria-modal`, focus moves into the panel,
  body scroll locks, Escape closes it, focus returns to the trigger, scroll
  restores.
- RSVP: conditional fields appear and disappear correctly, server-side zod
  errors render against the right field, and with Supabase unconfigured the
  form says so plainly instead of showing a false success.
- Admin: every `/admin/*` route 307s to the login page without a session, a
  forged session cookie is rejected, and the CSV export route is behind the
  same gate.

**Note for whoever tests next.** The in-app browser pane runs with
`document.visibilityState === "hidden"`, so `requestAnimationFrame` never
fires. React defers both the Suspense reveal and hydration through it, so an
interactive component can look permanently stuck on a loading state when
nothing is wrong. Test against `next start`, and if a component appears dead,
check `Object.keys(el).find(k => k.startsWith("__reactProps"))` before
assuming it is a bug.

## 14. Current priorities and next steps

**Blocking, before invitations are printed:**

1. Create the Supabase project, run `supabase db push`, set the three Supabase
   variables in Vercel.
2. Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`. There is no default and
   the admin area will not open without them.
3. Buy the domain and set `NEXT_PUBLIC_SITE_URL`. The address goes on the
   printed invitation, so it has to be settled first.

**As the couple confirm things:**

4. Fill in the venue names, addresses and map links in `lib/constants.ts`.
5. Fill in the sponsors and the wedding party once the list is final. Pastor
   Jomar needs the same list for the marriage certificate, so this unblocks
   two things at once.
6. Add Erick's guest-facing contact details.
7. **Ask Amari to confirm the 7:30 PM reading.** The whole reception derives
   from it (section 16, the 3 September session). If the couple are meant to
   walk in at 7:30 rather than 8:00, every time after it shifts by half an hour.
8. **Solve the gap.** Guests are free at about five and cannot get into the
   reception until 7:15. The site warns them now, which is not the same thing
   as fixing it.
9. Confirm the 5:00 AM dawn pictorial really is cancelled. It was in the
   workbook, it is absent from the coordinator's timeline, and the site has
   been changed to match the timeline.
10. Sign off the durations. They are ours, in five minute steps, because the
    programme sheet carries no times on it at all.

**Nice to have before the day:**

11. Replace the placeholder photographs after the prenup shoot.
12. Ask the couple for the how-we-met story.
13. Add the three Playwright tests.

## 15. Future improvements

- A private, tokenised guest link so each invitation prefills its own names
- Bulk download of the whole album as a zip, built server side
- A seating-plan view generated from the RSVP data
- Real image dimensions captured at upload, to remove all gallery CLS
- A Filipino language toggle, if enough guests would use it

## 16. Session notes

**3 September 2026, session four: the real timeline arrives.**

This session went in two directions because the source material changed
underneath it. Worth reading before touching `SCHEDULE`.

It began with a request for the best SHORT reception programme, and one was
built: twelve items, 150 minutes, offsets counted from the doors opening
because no clock time was knowable. Then the couple sent two documents that
replaced the premise:

1. **The coordinator's on-the-day timeline** (Amari Events, with Makeup by
   April Jamille). Real clock times for the entire day, 7:00 AM to 8:00 PM.
2. **The host's reception programme sheet**, a full traditional running order
   of twenty-six items.

The couple chose the full running order, so the short programme was replaced
rather than lost to a regression. If a future session wonders why a carefully
argued twelve item programme is not in the file, that is why.

**What the timeline corrected, and this is the important part.** The site had
been asserting things that were simply not true, all inherited from the
planning workbook rather than invented here:

- A **5:00 AM golden-hour pictorial** at the church for the entourage. There is
  no such thing in the real timeline. The day starts at 7:00 AM and the
  entourage is called at 11:30 AM. Anyone reading the old page would have set
  a four in the morning alarm for nothing.
- **"Reception: immediately after the ceremony."** It is not. The ceremony is
  at 4:00 PM and the reception doors do not open until 7:15 PM, because the
  couple shoot at the church until six and the reception is at a second venue.
  Guests had been promised the opposite.
- **"Two places, five minutes apart."** The timeline gives travel a 45 minute
  window. Softened rather than restated.

**How the two documents were joined.** The timeline fixes three anchors: doors
7:15 PM, "grand entrance, reception ready" 7:30 PM, and "programme starts"
8:00 PM. The programme sheet puts the grand entrance at item VI, after the
welcome, the parents, the sponsors and the entourage parade. Those reconcile
exactly one way: the entrance SEQUENCE starts at 7:30 and the couple are
presented at 8:00, which is where the timeline says the programme starts. The
durations were chosen so the derived clock lands on 8:00 PM for the grand
entrance, which is the check that the reading holds. **Amari should confirm it
before anything is printed.**

**Times are derived, never written twice.** Reception items carry `minutes`
only. `RECEPTION_TIMELINE` computes both the offset and the clock from the
7:15 PM doors, so changing one duration moves everything after it. The
durations are ours: the programme sheet carries no times at all.

Total is 255 minutes, doors to goodnight, ending about 11:30 PM.

**The games.** Kristinne asked for games and described one she had seen: the
whole room stands, music plays, everyone dances, and the winners get the
first photograph with the couple plus first place in the line for food. Erick
leads it, and it opens the reception. The programme sheet independently
contains the same mechanic at its item XII, which is a good sign the
placement is right. Three more games come with the full running order: the
card under the chair, the trivia round, and the Cinderella game after the
garter toss.

**Panalangin.** At the cake cutting the whole room sings it while the couple
slice and blow out the candle. The item copy asks guests to sing rather than
watch, and there is an FAQ so nobody is caught out.

**A real bug found on the way past, and it was not new.** `/our-story`
scrolled sideways at 375px. The cause is worth writing down because it looks
like it is already handled and is not.

`globals.css` sets `overflow-wrap: break-word` on headings, which lets a long
word wrap so it does not visibly overflow. It does NOT reduce the element's
min-content width. That heading is `#CARLOobNgdiyoskayKRISTINNE`, whose
min-content width measured 492px, and it sits in a CSS grid item, where
`min-width: auto` means the item refuses to shrink below its min-content. So
the grid held the document at 511px inside a 375px viewport, and the fixed
header stretched to match, which is what made it look like a header bug.

Only `overflow-wrap: anywhere` or `word-break: break-all` changes min-content.
The Hero and the Footer already use `break-all` on the hashtag, which is why
they were fine; that one heading missed the pattern. Fixed by wrapping it in a
`break-all` span, which also moved it onto `SITE.hashtag` instead of a
hardcoded literal, so it was breaking two rules at once. Min-content went from
492px to 23px.

Note that this contradicts the "no horizontal overflow at 375px on any page"
line recorded on 23 July. Whoever checks next: measure, do not trust the note.
All eight public pages were re-measured this session and are clean.

**Still open:** the gap. Guests finish the ceremony around five and cannot get
into the reception until 7:15. That is over two hours with nowhere to be. The
site now warns them plainly instead of promising "immediately after", but the
warning is not a solution and this is a coordination problem rather than a
website one.

**23 July 2026, session three: composition.** The client's second note was
"make white the primary background" and "it doesn't look unique at all." Both
landed. The ground went from ivory to pure white, and more importantly the
layout stopped being the house template: the ribbon, the editorial hero, the
folio numerals and left-aligned-by-default came out of this pass. The lesson
worth keeping is that the first two rounds both argued about colour when the
thing making it generic was that every section was a centred stack.

**23 July 2026, session two: the palette flip.** The client's reaction to the
dark build was immediate and correct: "it's so dark, do you think someone who
has a wedding will like this?" They were right, and the diagnosis was a
misread brief rather than a matter of taste. See section 8, deviation 1.

The flip itself was cheap precisely because the tokens were disciplined: a
palette swap in `tailwind.config.ts`, a rewritten semantic layer in
`globals.css`, one new `.on-ink` class that inverts a whole subtree, and a
mechanical pass over the components. No component contained a hex code, which
is the entire argument for that rule.

Copy was warmed at the same time: the driest deadpan lines now read as
affectionate rather than clipped, while keeping the humour.

One new check came out of it. `@apply border-white/12` passed typecheck,
lint, qa, grammar and security untouched, then 500'd every route, because
none of those five compile CSS and 12 is not on Tailwind's opacity scale.
`scripts/css-check.ts` now compiles `globals.css` in `npm run check`, and it
was verified by reintroducing the exact bug and confirming a non-zero exit.

**22 July 2026, initial build.** Whole site built in one session from the two
workbook documents plus the planning group chat. Design direction was checked
against current writing on 2026 wedding design, which points at editorial
typography, jewel tones and immersive atmosphere rather than script-heavy
minimalism; the midnight aurora concept was chosen on that basis and because
it is the only honest reading of "blue, violet, black, couple in white".

The hardest call was what to do about how much is still undecided. Inventing a
venue name would have been worse than useless, since it would have been
printed on something. The placeholder system in `components/Pending.tsx` is
the answer: driven by flags in `lib/constants.ts`, visible as an intentional
chip, and self-removing the moment a real value is filled in.

The two most useful findings of the session both came from checking the real
output rather than the source. Reading the production HTML exposed the
`loading.tsx` streaming problem (decision 7 above), and measuring computed
styles in the browser exposed two contrast failures and an undersized tap
target. None of the three would have been visible from reading the code, and
all three were shipping defects.

---

Built with care by [Erick Cabal](https://erickcabal.com).
