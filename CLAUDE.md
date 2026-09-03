# CLAUDE.md

Condensed brief for an AI assistant working on this project. Read
`handoff.md` for the full picture.

## What this is

The wedding website for John Carlo Alcantara and Kristinne Monzon.
17 October 2026, 4:00 PM, Rosario, Cavite. 100 guests.
Hashtag `#CARLOobNgdiyoskayKRISTINNE`.

Next.js 16 App Router, React 19, TypeScript strict, Tailwind 3.4, Supabase,
Vercel. Dev port **3028** (the folder number).

## Non-negotiables

1. **`PROJECT_RULES.md` is the standard.** Not just at launch. Every session.
2. **Never an em dash.** Commas, periods or parentheses. `npm run grammar`
   enforces it and gates the build.
3. **Every wedding fact comes from `lib/constants.ts`.** Never hardcode a
   date, a name or a venue in a component.
4. **Never invent a missing fact.** Anything undecided is `pending: true` in
   `constants.ts` and renders as a "To be confirmed" chip. A plausible lie
   about a venue could end up printed on an invitation.
5. **No money, no vendors, no budget on the site or in this repo.** The
   planning workbook has all of it. The website is for guests only.
6. **No hex codes in components.** `tailwind.config.ts` plus the semantic
   layer in `styles/globals.css`.
7. **The motif is the wedding's, not the website's.** "Blue, violet, black,
   couple in white" describes what the entourage wears. Do not turn black
   back into the page background. That was tried and it read as sombre.
8. **`requireAuth()` on the first line of every admin Server Action and route
   handler.** A Server Action is a public endpoint.
9. **`lib/store.ts` is the only module that touches Supabase.**
10. **Attribution to Erick Cabal stays in the footer.** Do not remove it.

## Design, in one paragraph

Editorial, on white. Pure white ground (`brand.paper`), near-black type (`brand.ink`),
blue and violet only as a soft wash, the hairline rule, the monogram ring and
the dress-code swatches. Exactly one DARK band per page, the closing CTA,
which uses the `.on-ink` class to flip every child automatically.
Bodoni Moda display, Inter body. Eyebrow tracking is `tracking-eyebrow`
(0.28em) everywhere, never a literal value. Stagger is `index * 80`. Easing is
always expo-out. Sections are `py-16 sm:py-20 lg:py-28`. Body copy is 75
percent ink, and 60 percent is the muted floor: 55 percent measures 4.47:1 on
paper and fails.

Exactly two CTAs in every hero, primary plus outline. Never one, never three.

**What stops it looking generic**, and what not to undo: the ribbon threading
the whole document (`components/Ribbon.tsx`), the asymmetric left-aligned hero
with the names at display-2xl, the ghosted folio numerals hanging in the
margin, and `SectionHeading` defaulting to left rather than centre. A previous
version centred everything and read as a template.

## Commands

```bash
npm run dev          # port 3028
npm run check        # qa + grammar + security + css. Gates the Vercel build.
npm run typecheck    # run separately from build (OOM otherwise)
npm run build
```

## Definition of Done

Feature, QA review, security review, mobile check, docs updated,
`USER_MANUAL.md` updated if a workflow changed, `handoff.md` updated,
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
