# Portfolio Implementation Rules

Standing rules for every session that works on the portfolio reconstruction.

**Scope:** binding constraints specific to this reconstruction.
[CLAUDE.md](CLAUDE.md) remains the project-wide contract and outranks nothing
here — these rules refine it, they do not replace it. The visual specification
is [design.md](design.md), sequencing is [plan.md](plan.md), verification is
[test.md](test.md).

Precedence when rules collide:

```
1. The user's explicit instruction in this session
2. CLAUDE.md
3. rule.md (this file)
4. design.md
5. The relevant skill
```

---

## Rule 1 — The references are read-only

Never rename, move, edit, overwrite, delete or re-encode anything in
`inspiration/`. Never use a file from `inspiration/` as a site asset — copy
nothing from it into `public/` or `src/assets/`. It is measurement material
only.

The video file is `portfolio.annimation.mp4` (double `n`). Do not "fix" the name.

---

## Rule 2 — Reference fidelity over taste

Reproduce what the references show. Do not redesign, modernise, simplify or
improve the reference unless explicitly asked.

If a project skill recommends an aesthetic that contradicts the reference, the
reference wins and the conflict gets recorded in design.md §17. Specifically:
pill buttons stay pills, the palette stays monochrome, the containers stay at
their measured widths, and no pastel accents or ambient gradients are added.

---

## Rule 3 — Inspect before implementing

Read the existing implementation before changing it. Before writing a component,
check whether `src/components/ui/`, `src/animations/presets/` or `src/hooks/`
already solves the problem. Extend before you add; add before you duplicate.

Never rewrite a working file from scratch to make an edit easier.

---

## Rule 4 — Do not invent behaviour

If a behaviour is not visible in the references, do not build it. The
NOT OBSERVED list in design.md §17 is binding — no sticky header, no scroll-spy,
no underline animation, no card lift, no image zoom, no dot pulse, no parallax,
no custom cursor, no contact form, no timeline rail.

Two categories are permitted despite not being observed, and both must be
labelled as such in code comments and in the PR description:

- **Accessibility requirements** — real anchors, `aria-expanded`, focus
  management, keyboard operation. Required by CLAUDE.md §10.
- **Responsive behaviour** — every breakpoint below 1280 px is inferred
  (design.md §16), including the mobile navigation disclosure.

Where the reference is genuinely ambiguous (the service accordion's hover-vs-click
trigger), pick the accessible reading, state the ambiguity, and record the
decision in design.md.

---

## Rule 5 — Animation goes through the existing pipeline

Anime.js v4 only. No GSAP, Framer Motion, Motion One, React Spring, AOS, or CSS
animation library — regardless of what any skill recommends.

Required path:

```
component -> useAnimation / useAnimationOnHover / useScrollReveal / usePointerFollow
          -> preset factory in src/animations/presets/
          -> createAnimation / shouldReduceMotion
          -> Anime.js v4
```

- Never call `animate()` directly inside a component.
- Reusable motion becomes a preset factory and is re-exported from
  `src/animations/index.js`.
- Scroll work uses Anime.js `onScroll()` or `IntersectionObserver` — never
  `window.addEventListener('scroll')`.
- Pointer-following uses `createAnimatable`, not a hand-rolled RAF loop.
- Every scope reverts on unmount. Every listener, observer and timer is cleaned up.
- Animate `transform` and `opacity` only.

---

## Rule 6 — The one sanctioned layout-animation exception

The service accordion changes height. That size change is implemented as a
**CSS transition on `grid-template-rows` (`0fr` → `1fr`)** on the collapsible
wrapper.

This is the only place in the project where an animation affects layout, it is a
CSS transition rather than a JS animation, and it never writes `top`, `left`,
`width` or `height`. Everything else about the accordion — background crossfade,
title colour, description, media, affordance swap — runs through Anime.js on
`opacity` and `transform`.

Do not extend this exception to any other component. Do not animate `height`,
`max-height`, `top`, `left` or `width` anywhere, in CSS or JS.

---

## Rule 7 — Reduced motion is not optional

Every animation entry point calls `shouldReduceMotion()` and bails out.

Every element is authored in its **final** visual state, so a skipped animation
leaves a correct, complete, usable page. Never author an element at
`opacity: 0` or an off-screen transform and rely on JavaScript to reveal it.

Under reduced motion, both pointer-following interactions are disabled entirely
and their underlying actions remain reachable.

---

## Rule 8 — Content is data, not JSX

Every repeated content structure lives in
`src/features/portfolio/data/` as a plain array or object: `projects`,
`services`, `experience`, `socials`, `navigation`, `profile`.

Components map over data. Never duplicate a JSX block to add a second project,
service or role. Adding an entry to a data file must require no JSX change
(verified in test.md §10).

---

## Rule 9 — Styling is Tailwind v4, CSS-first

- All theme configuration goes in `src/styles/index.css` via `@theme`.
- Never create `tailwind.config.js`. Never mix v3 and v4 patterns.
- Colours, motion values and type sizes come from tokens, never hard-coded hexes
  or magic numbers scattered through components.
- Complete class names only — never build them dynamically.
- Prefer the built-in scale; reserve arbitrary values for the measured one-offs
  in design.md §6 that have no scale neighbour.
- Avoid `@apply`; do not expand the single existing use in the `body` base rule.

---

## Rule 10 — Components are reusable and correctly placed

- Generic, business-logic-free primitives go in `src/components/ui/`.
- Anything that knows about projects, services or experience goes in
  `src/features/portfolio/components/`.
- Route-level composition stays thin, in `src/pages/` or the feature's `pages/`.
- Never put feature-specific business logic in `src/components/ui/`.
- Function components with hooks; named export plus default export; barrel
  `index.js` per directory. No PropTypes.
- Do not add new top-level `src/` directories.

---

## Rule 11 — Every section is responsive

No section ships desktop-only. Every one is verified at 1440, 1280, 1024, 768,
430 and 375 px.

- Zero horizontal page overflow at every width. Wide content scrolls inside its
  own container.
- `min-h-[100dvh]`, never `h-screen`.
- CSS Grid over flexbox percentage maths for multi-column layouts.
- Pointer-only interactions are gated behind
  `(hover: hover) and (pointer: fine)` and have a tap or click equivalent.

---

## Rule 12 — Every interactive element is accessible

- Real `<button>` for actions, real `<a>` for navigation. Never a `<div>` with
  an `onClick`.
- Visible focus everywhere, using the existing
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`
  pattern. Never remove a focus indicator without replacing it.
- Icon-only controls get an `aria-label`; decorative icons and all ghost
  watermarks get `aria-hidden="true"`.
- Correct heading outline, one `<h1>` per route, no skipped levels.
- Meet 4.5:1 for body text and 3:1 for large text and UI borders. The
  reference's `#AAAAAA` nav counters fail this and must be fixed, not copied
  (design.md §19).

---

## Rule 13 — No new dependencies without approval

The project ships three runtime dependencies. Before adding anything, work
through CLAUDE.md §18 in order.

Never install a package because a skill mentions it. No icon library — use
inline SVG. No utility library, no state library, no animation library.

`react-router-dom` is the one anticipated addition, and it is gated on the
owner's explicit approval (design.md §21.1, plan.md Phase 1.1). If approval is
withheld, implement the History-API fallback and say what was lost.

---

## Rule 14 — Validate every change

Before reporting a phase complete, actually run:

```
npm run lint
npm run format:check
npm run build
```

If `format:check` fails, run `npm run format` and re-check.

Never claim a command passed unless it was executed and its output was read.
Never claim a visual or browser check happened when it did not — say plainly
that no browser was available.

---

## Rule 15 — Visual QA against the references

At the end of each section's phase, compare the running page side by side with
its reference file at a 1440 × 982 viewport, using the test.md §7 matrix.

Measure rather than eyeball where a number exists in design.md §6: container
widths, grid gap, row pitch, type scale. Report deviations rather than quietly
accepting them.

If no browser is available, say so and mark the visual checks as not run.

---

## Rule 16 — Reference content is scaffolding, not the deliverable

Every name, project, company, date, role and line of copy in the references
belongs to another designer. They may be used **only** as structural
placeholders during development, and every one must be replaced with the site
owner's real content before the site ships.

No placeholder names, no Lorem Ipsum, no AI copywriting clichés ("Elevate",
"Seamless", "Unleash", "Next-Gen", "Delve"). No emoji in code, markup, copy or
alt text.

---

## Rule 17 — Fix the reference's defects, and say so

The reference contains real errors. Reproduce the design, not the mistakes:

- `Intagram` is a typo — ship `Instagram`.
- `#AAAAAA` nav counters fail contrast — fix per design.md §19.
- Nav links that lead nowhere because the header is not sticky — keep the
  non-sticky header, but make the anchors work.

Every such correction is documented in design.md so it is a recorded decision
rather than an accidental drift.

---

## Rule 18 — Do not break what works

Preserve existing behaviour. `Button`, `Card`, `Container`, `useAnimation`,
`useAnimationOnHover` and the four existing presets are in use — extend them,
add variants, but do not change their current defaults or signatures.

Run the test.md §10 regression list after touching any shared primitive or the
animation layer.

---

## Rule 19 — No premature refactoring and no over-engineering

Build what the current phase needs. Do not create abstractions, providers,
managers, services or generic hooks without a real, present use case.

`store/`, `services/`, `providers/` and `lib/` are markers of where things go
when needed, not a to-do list. Do not add a state library until prop-drilling
is a genuine problem. Do not build a theme provider — there is no second theme.

---

## Rule 20 — Finish the work and report it honestly

No stubs, no `// TODO`, no `// ...`, no "the rest follows the same pattern". If
a phase is genuinely blocked on a missing asset or an unanswered decision,
complete every other part of it in full and state exactly what was left out and
why.

Update [plan.md](plan.md) checkboxes to reflect what actually happened. Report
failures with their output. State plainly what was not verified.

---

## Session Checklist

At the start of any session that touches this reconstruction:

```
Read CLAUDE.md
     v
Read rule.md (this file)
     v
Read the relevant design.md section
     v
Check plan.md for the current phase and its blockers
     v
Identify required skills via CLAUDE.md section 13
     v
Load those SKILL.md files
     v
Inspect the existing implementation
     v
Implement
     v
Run the relevant test.md checks
     v
Run lint / format:check / build
     v
Visual QA against the reference
     v
Update plan.md
```
