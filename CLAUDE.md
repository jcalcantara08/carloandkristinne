# CLAUDE.md

Condensed brief for an AI assistant working on this project. Read
`docs/DEVELOPER-HANDOFF.md` for the full picture.

## What this is

The wedding website for Kristinne Monzon and John Carlo Alcantara.
17 October 2026, 4:00 PM: ceremony at Jesus the Counselor Church, General
Trias, Cavite; reception at Servando's Restaurant, Rosario, Cavite. 100
guests. Hashtag `#CARLOobngDiyoskayKRISTINNE`. Kristinne's name comes first
and the monogram is KC, because that is how the printed invitation has it.

Next.js 16 App Router, React 19, TypeScript strict, Tailwind 3.4, Supabase,
Vercel. Dev port **3028** (the folder number).

## Non-negotiables

1. **`PROJECT_RULES.md` is the standard.** Not just at launch. Every session.
2. **Never an em dash.** Commas, periods or parentheses. `npm run grammar`
   enforces it and gates the build.
3. **Every wedding fact comes from `lib/constants.ts` or the site document
   (`lib/content-schema.ts`, edited under Edit the website).** Never hardcode
   a date, a name, a venue or a paragraph of copy in a component. Dates, the
   guest cap, form limits and the palette stay in constants; words and page
   photographs live in the document, with defaults in `DEFAULT_CONTENT`.
4. **Never invent a missing fact.** Anything undecided is `pending: true` in
   `constants.ts`. With `SHOW_PENDING` false (the live setting) it is simply
   not rendered; with it true, it renders as a "To be confirmed" chip so you
   can see everything still missing. A plausible lie about a venue could end
   up printed on an invitation.
5. **No money, no vendors, no budget on the site or in this repo.** The
   planning workbook has all of it. The website is for guests only.
6. **No hex codes in components.** `tailwind.config.ts` plus the semantic
   layer in `styles/globals.css`.
7. **The branding is the printed invitation suite's** (five cards the
   couple sent on 17 September 2026, filed in the sibling photos folder under
   `invitation-suite/`). Its type is a deep plum, its names are a rose
   purple, its florals are pink, lavender and dusty blue on white. So: plum
   and mauve are the accents, the attire blues are swatches and washes, and
   white is the ground. Do not turn black back into the page background
   (tried, read as sombre). The earlier "no violet" rule came from the first
   two attire guides; the full guide has purples for the parents and the maid
   of honour, and the invitation itself is plum.
8. **`requireAuth()` on the first line of every admin Server Action and route
   handler.** A Server Action is a public endpoint.
   **Nothing hard-deletes except `deleteForGood()`**, and only the recycle bin
   and the daily purge call it. Delete means "to the bin for 14 days".
9. **`lib/store.ts` is the only module that touches Supabase.**
10. **Attribution to Erick Cabal stays in the footer.** Do not remove it.

## Design, in one paragraph

Classic, centred, on white. Pure white ground (`brand.paper`) with a faint
ice-blue tint (`paper-200`) for rhythm, navy-black type (`brand.ink`), and the
invitation's purples as accents: `plum-500` (8.9:1, the eyebrow, links and
the focus ring) and `mauve-500` (5.3:1, the ampersand). The attire blues
(`steel`, `cornflower`, `dusty`) stay defined for swatches, the monogram
ring and washes, never text. Exactly
one DARK band per page, the closing CTA, using `.on-ink`. Cormorant Garamond
display at weight 500 and 600, Inter body. Eyebrow tracking is
`tracking-eyebrow` (0.28em), never a literal. Stagger is `index * 80`, easing
expo-out, sections `py-16 sm:py-20 lg:py-28`. Body copy is 75 percent ink; 60
is the muted floor (4.9:1), 55 fails.

Exactly two CTAs in every hero, primary plus outline. Never one, never three.

**The design history, so it is not repeated.** Round one was near-black and
read as sombre. Round two was white but centred and read as a template. Round
three added a ribbon, an asymmetric Bodoni hero at 8rem, ghosted folio
numerals and blurred colour blobs to look unique, and the client called it
ugly. Round four (17 September 2026) followed what two dozen well-liked
wedding sites actually do: soft palette from the real attire, classic serif
plus clean sans, centred, generous space, no decoration, and a hero built to
lead with a photograph. The couple's photographs arrived on 17 September and
live in `public/photos`; the hero shows one beside the type (never a veil
with the names over their faces, tried, read badly). Do not reintroduce the
ribbon, the blobs, the folios or Bodoni.

## Commands

```bash
npm run dev          # port 3028
npm run check        # qa + grammar + security + css. Gates the Vercel build.
npm run typecheck    # run separately from build (OOM otherwise)
npm run build
```

## Definition of Done

Feature, QA review, security review, mobile check, docs updated,
`docs/USER-MANUAL.md` updated if a workflow changed, `docs/DEVELOPER-HANDOFF.md` updated,
repository cleaned, zero console errors, branding consistent, accessibility
reviewed, performance reviewed.

## Gotchas

- **OneDrive breaks builds.** `node_modules` in a synced folder causes
  phantom permission errors. Exclude it from sync.
- **`next lint` does not exist in Next 16.** `npm run lint` calls `eslint`.
- **`middleware.ts` is `proxy.ts` in Next 16**, exporting `proxy` rather than
  `middleware`. Same behaviour, same `config.matcher`.
- **Zod is v4.** Use `z.flattenError(error)`, not `error.flatten()`.
- **`npm run check` now compiles the CSS** (`scripts/css-check.ts`). An
  invalid utility inside an `@apply`, such as an opacity step that is not on
  Tailwind's scale, is a build-breaking error that no other check catches.
- **RLS has no policies on purpose.** Do not "fix" it by adding a public read
  policy. See `supabase/migrations/0002_rls.sql`.
- **The storage bucket is public for reads on purpose.** The couple asked that
  guests be able to download the photographs.
- **`.env.local` syncs to OneDrive** even though git ignores it. Gitignore is
  not a security control here.
