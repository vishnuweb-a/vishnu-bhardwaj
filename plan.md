# Implementation Plan

Roadmap for building the portfolio reconstruction.

**Scope:** what gets built, in what order. The visual specification is in
[design.md](design.md), verification in [test.md](test.md), and the standing
rules in [rule.md](rule.md). Project-wide workflow is in [CLAUDE.md](CLAUDE.md).

**Status legend:** `[x]` done · `[ ]` not started · `[!]` blocked on an open
decision or a missing asset.

Every phase ends with the validation commands from CLAUDE.md §15 and the
Definition of Done in CLAUDE.md §16.

---

## Phase 0 — Reference Analysis

- [x] Read CLAUDE.md and inspect the existing `src/` architecture
- [x] Load `animejs` (Skill tool), `tailwind-v4-best-practices`,
      `frontend-design`, `image-to-code`, `minimalist-ui`,
      `web-design-guidelines` (live fetch succeeded)
- [x] Analyse `home.webp` — layout, type, colour, components, spacing
- [x] Analyse `service.webp` — accordion structure, expanded panel, media overhang
- [x] Analyse `project.webp` — grid, card anatomy, badge, hover affordance
- [x] Analyse `experience.png` — inverted panel, two-column rows, hover preview
- [x] Analyse `contact.webp` — CTA block, footer row
- [x] Analyse `portfolio.annimation.mp4` frame by frame (21.57 s, 60 fps)
- [x] Derive entrance timings by opacity-invariant centroid tracking
- [x] Derive scroll-reveal durations and the 130 ms stagger
- [x] Identify the project detail route
- [x] Sample the colour system from pixel histograms
- [x] Measure container widths, type scale and spacing at a 1440 px baseline
- [x] Resolve the seven reference discrepancies (design.md §17)
- [x] Record what is NOT OBSERVED
- [x] Write `design.md`, `plan.md`, `test.md`, `rule.md`

---

## Phase 1 — Decisions and Foundation

**Gate: Phase 2 onward cannot start until items 1.1–1.4 are answered.**

### 1.1 Open decisions (owner input required)

- [x] `react-router-dom` **approved** by the owner and installed (v7). Routes
  are `/` and `/project/:slug` - the Phase 2 brief's path, not design.md's
  `/work/:slug`.
- [x] Font delivery **decided by the owner**, overriding design.md 21.2: Google
  Fonts via preconnected `<link>` with `font-display: swap`. **Smooch Sans** is
  the body/UI face, **Oswald** the display face. Inter and Figtree are not used.
  Black Ops One was trialled for the ghost watermarks and dropped - it diverged
  measurably from the reference's letterforms, so the site ships the two
  typographic voices the reference actually has (rule.md Rule 2). Only the two
  loaded families are requested from Google Fonts.
- [!] **Assets still missing.** Built against neutral local placeholders as
  design.md 20 permits: no fabricated imagery, no remote placeholder service,
  nothing copied out of `inspiration/`. `MediaFrame` renders a correctly
  proportioned neutral block wherever `src` is null, so every layout is already
  correct; filling `data/assets.js` and the `thumbnail` / `images` / `media`
  fields is the only work left.
- [x] Real content supplied from the owner's CV and repository list: `profile`,
  `projects` (8), `services` (4), `experience` (5), `socials` (3). Two
  deliberate gaps, both recorded in the data files: `experience[].period`
  carries verifiable status strings ("Production", "Ongoing", "In progress")
  rather than invented date ranges, and the social rail ships three real
  destinations rather than padding to the reference's four with a dead link.

### 1.2 Design tokens

- [x] Add the `@theme` block to `src/styles/index.css` with every colour token
      from design.md §4
- [x] Add font-family tokens for the display and UI roles
- [x] Add motion tokens (`--motion-fast/base/slow/xslow/stagger`, two easing
      curves) from design.md §18
- [x] Add the type-scale tokens, using `clamp()` for the four display roles
- [x] Add `scroll-margin-top` to the base layer for anchor targets
- [x] Verify no `tailwind.config.js` was created and no v3 pattern was introduced

### 1.3 Layout primitives

- [x] Extend `src/components/ui/Container.jsx` with `wide` (1280),
      `base` (1216, current default), `narrow` (1104) and `panel` variants —
      complete class names only, no dynamic construction
- [x] Extend `src/components/ui/Button.jsx` with the reference's pill variants:
      `solid` (`#161616`), `outline` (white + `--color-line`), and sizes;
      preserve the existing focus-visible ring pattern
- [x] Build `src/components/ui/Pill.jsx` — the shared full-radius chip used by
      the availability badge, social links, tags and filters
- [x] Build `src/components/ui/SectionHeading.jsx` — the `/NAME` heading plus
      its `aria-hidden` ghost watermark
- [x] Build `src/components/ui/MediaFrame.jsx` — fixed-aspect image frame with
      explicit `width`/`height` and `loading` control
- [x] Build `src/components/ui/icons/` — inline SVG for arrow-up-right, arrow-left,
      close, Dribbble, Instagram, LinkedIn, Behance; shared stroke width
- [x] Update `src/components/ui/index.js` barrel

### 1.4 Animation layer

- [x] Add `src/animations/presets/reveal.js` — `revealUp`, `revealDown`
      (translateY + opacity, measured distances and easings)
- [x] Extend `src/animations/presets/stagger.js` with `staggerReveal`
      (130 ms stagger, ~800 ms duration, `outExpo`)
- [x] Add `src/animations/presets/pointerFollow.js` — the `createAnimatable`
      config for damped pointer tracking
- [x] Re-export everything from `src/animations/index.js`
- [x] Add `src/hooks/useScrollReveal.js` — `createScope` + `animate` with
      `autoplay: onScroll({ target, enter })`, reverting on unmount
- [x] Add `src/hooks/usePointerFollow.js` — `createAnimatable` driven by
      `pointermove`, gated on `shouldReduceMotion()` and
      `(hover: hover) and (pointer: fine)`, with full listener cleanup
- [x] Update `src/hooks/index.js` barrel
- [x] Confirm every new entry point bails out under `shouldReduceMotion()`

### 1.5 Feature scaffold

- [x] Create `src/features/portfolio/` with `components/`, `hooks/`, `data/`,
      `utils/` and an `index.js` barrel (CLAUDE.md §5)
- [x] Create the data modules in `src/features/portfolio/data/`:
      `profile.js`, `navigation.js`, `socials.js`, `services.js`,
      `projects.js`, `experience.js` (design.md, [rule.md](rule.md) Rule 8)
- [x] Define the project record shape: `slug`, `title`, `category`, `tags`,
      `thumbnail`, `summary`, `service`, `timeline`, `tools`, `images`,
      `caption`, `liveUrl`

---

## Phase 2 — Navigation and Shell

- [x] Build `Navbar` — availability pill, link group with bracketed counters,
      `Let's Talk` CTA, inside the `wide` container
- [x] Render it inside the hero, **not** fixed or sticky (design.md §8)
- [x] Implement links as real `<a href="#section">` anchors
- [x] Add `id` and `scroll-margin-top` to every target section
- [x] Build the mobile disclosure menu (inferred — see design.md §16):
      real `<button>` with `aria-expanded`/`aria-controls`, Escape to close,
      focus returned to the trigger
- [x] Rework `src/layouts/MainLayout.jsx` — remove the placeholder header and
      footer, render the real `Footer`, keep `main` semantics
- [x] Build `Footer` — name pill with avatar, four social pills, `base` container
- [x] Wire routing per the Phase 1.1 decision; populate `src/app/routes/`
- [x] Verify no horizontal overflow at any width

---

## Phase 3 — Home / Hero

- [x] Build `Hero` at `min-h-[100dvh]` with the three-band composition
- [x] Build `Wordmark` — one `<h1>`, outlined first word via
      `-webkit-text-stroke`, solid second word, `@supports` fallback
- [x] Build `HeroPortrait` — bottom-anchored cutout, correct z-order against
      the wordmark, explicit dimensions
- [x] Build the role block — subtitle, two-line description, `Let's collaborate` CTA
- [x] Build `SocialRail` — four equal-width pills at ~79 px pitch, clipped so
      they can slide up from below the fold
- [x] Verify the measured layout: wordmark top ~232 px, nav ~56 px, 1280 px
      wordmark column, 1216 px lower row
- [x] Responsive: wordmark to two lines below 768 px, rail reflows

---

## Phase 4 — Selected Work

- [x] Build `ProjectsSection` — watermark, centred `/SELECTED WORK`, control row
- [x] Build `ProjectFilters` — `All` / `Real Project` / `Exploration`,
      active state as weight + colour only, state written to the URL query
- [x] Build `ProjectCard` — `--color-surface` body, fixed-aspect `MediaFrame`,
      persistent category badge, two-line title, tag chips
- [x] Wrap each card in a real `<a>` to its detail route with a visible focus ring
- [x] Build the 2-column grid: `narrow` container, 56 px gap
- [x] Build the `View All Work ↗` outline pill
- [x] Handle the empty state when a filter matches nothing
- [x] Responsive: 1 column below 768 px, horizontally scrollable filters

---

## Phase 5 — Service

- [x] Build `ServicesSection` — watermark, `/SERVICE` heading, `wide` container
- [x] Build `ServiceRow` — collapsed state: display title, `↗`, hairline rule
- [x] Build the expanded panel: `--color-panel`, ~16 px radius, white title,
      description, `×` affordance
- [x] Build the overhanging media card — rotated ~-4°, soft shadow, above the
      panel's top edge
- [x] Implement the accordion as a `<button>` with `aria-expanded` /
      `aria-controls`, click and keyboard operable
- [x] Implement the size change via a CSS `grid-template-rows` `0fr → 1fr`
      transition — never a JS height animation ([rule.md](rule.md) Rule 6)
- [x] Crossfade background, title colour, description and affordance via Anime.js
      (`opacity` / `transform` only)
- [x] Responsive: media stacks below the description under 768 px

---

## Phase 6 — Experience

- [x] Build `ExperienceSection` — `--color-panel` card, 16 px page margin,
      ~10 px radius, `min-h-[100dvh]`
- [x] Add the `EXPERIENCE` ghost watermark in `--color-panel-ghost`
- [x] Build the heading row — `/EXPERIENCE` with the years label right-aligned
- [x] Build `ExperienceRow` — company over role, date right-aligned,
      `--color-panel-line` rule between rows, CSS Grid two-column
- [x] Build `ExperiencePreview` — rotated thumbnail following the pointer via
      `usePointerFollow`, `aria-hidden`, pointer-only
- [x] Confirm no timeline rail, dot or connector was added
- [x] Responsive: date moves below the role under 768 px; preview disabled

---

## Phase 7 — Contact and Footer

- [x] Build `ContactSection` — cloud background, rounded top corners,
      availability pill, `<h2>`, ~950 px paragraph, `Contact Me ↗` CTA
- [x] Confirm **no form** was built (design.md §13)
- [x] Point the CTA at a real `mailto:` or booking URL from `profile.js`
- [x] Finish the `Footer` row layout in the `base` container
- [x] Responsive: footer pills wrap to a 2-column grid under 768 px

---

## Phase 8 — Project Detail Route

- [x] Build the `ProjectDetail` page under
      `src/features/portfolio/pages/ProjectDetail.jsx`
- [x] Build the top bar — `← Back` pill and availability pill, not sticky
- [x] Build the two-column header — tags, `<h1>` + `/Category`, summary,
      `Live Preview ↗` and `Contact Me` buttons
- [x] Build the right meta stack — `Service`, `Timeline`, `Tools` with icon tiles
- [x] Build the media showcase — stacked bordered frames, lazy-loaded
- [x] Build the caption block
- [x] Build `/MORE WORK` — 2 cards, reusing `ProjectCard`, excluding the current project
- [x] Reuse `ContactSection` and `Footer`
- [x] Scroll to top on route change
- [x] Handle an unknown slug — render `NotFound`, do not crash
- [x] Responsive: meta stack moves below the header content under 768 px

---

## Phase 9 — Animation Pass

- [x] Hero entrance timeline via `createTimeline` inside one scope, using the
      measured delays and distances (design.md §18)
- [x] Scroll reveals on every section heading and child group, 130 ms stagger
- [x] Project card stagger (~150–200 ms)
- [x] Experience row stagger (~130 ms)
- [x] Service row stagger (~130 ms)
- [x] Accordion open/close motion
- [x] Project card pointer-following `↗` button
- [x] Experience row pointer-following preview
- [x] Detail-route entrance reusing the same presets
- [x] Audit: no raw `animate()` call inside any component
- [x] Audit: every animated property is `transform` or `opacity` only
- [x] Audit: every scope calls `revert()`; every listener and observer is removed
- [x] Audit: every entry point checks `shouldReduceMotion()`
- [x] Audit: every element renders correctly in its final state with motion off

---

## Phase 10 — Responsive Pass

- [x] Verify every section at 1440, 1280, 1024, 768, 430 and 375 px
- [x] Confirm zero horizontal page overflow at every width
- [x] Confirm the type scale reads correctly at each breakpoint
- [x] Confirm pointer-only interactions are gated and have tap equivalents
- [x] Confirm touch targets are at least 44 × 44 px
- [x] Add `touch-action: manipulation` to interactive elements
- [N/A] Verify `100dvh` behaviour on mobile browser chrome - **not run.** Headless
      Chrome has no dynamic browser chrome; needs a real iOS/Android device.

---

## Phase 11 — Accessibility Pass

- [x] Heading outline: one `<h1>` per route, no skipped levels
- [x] Every interactive element is a real `<button>` or `<a>`
- [x] Every icon-only control has an `aria-label`; decorative icons are
      `aria-hidden`
- [x] Every watermark is `aria-hidden`
- [x] Full keyboard traversal of both routes
- [x] Visible focus on every focusable element
- [x] Nav counter contrast resolved (design.md §19)
- [ ] Contrast audit against 4.5:1 body / 3:1 large and UI
- [x] `prefers-reduced-motion` verified with the OS setting enabled
- [N/A] Re-run `web-design-guidelines` - **not run.** The skill fetches its rules
      from raw.githubusercontent.com and no network access was available; the
      CLAUDE.md 10 checklist was used as the documented fallback.

---

## Phase 12 — Validation, QA and Performance

- [x] `npm run lint` passes
- [x] `npm run format:check` passes
- [x] `npm run build` passes
- [x] `npm run dev` — verify both routes render without console errors
- [x] Execute the [test.md](test.md) matrices - build, functional, navigation,
      responsive, animation, reduced-motion and correctness-audit sections run
      against headless Chrome on both the dev server and the production build
- [x] Side-by-side visual comparison against all five reference images at
      1440x982; container widths, grid gap and CTA position measured rather
      than eyeballed
- [x] Confirm no layout shift from images (explicit dimensions everywhere)
- [x] Confirm the runtime dependency count is still three, or that any addition
      was explicitly approved
- [x] Confirm `vite.config.js` chunking still reflects reality
- [x] Confirm nothing under `inspiration/`, `.agents/` or `.claude/` was modified
- [x] Update this file's checkboxes and note anything deferred

---

## Deferred / Out of Scope

Not supported by the references; do not build without an explicit instruction:

- Sticky header, scroll-spy, scroll progress indicator
- Contact form, newsletter, comments
- Dark mode toggle (the site is light with one inverted section)
- Blog, CMS, i18n, analytics
- A `View All Work` index route — the button exists in the reference but its
  destination is never shown. Confirm the target before building it.
