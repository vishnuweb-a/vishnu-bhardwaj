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
- [x] **Assets supplied and integrated (Phase 13).** The owner delivered
  the source media and `information/`. Six of the eight asset classes in
  design.md 20
  are now filled from real media through `scripts/build-assets.py`; the contact
  background is the only class still missing and keeps the `.sky-wash` CSS
  approximation. Slots with no asset on record keep the neutral `MediaFrame`,
  which now carries the subject's name rather than a "pending" label.
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

## Phase 13 — Asset and Content Integration

Numbered 13 because this file's Phase 3 is already the hero build; the owner's
brief calls this work "Phase 3". Integrating the owner's supplied media and
`information/` into
the existing implementation. No
architectural change: the data layer, the animation pipeline and every component
signature are unchanged apart from two additive `MediaFrame` props.

### 13.1 Inspection

- [x] Read `information/project.js` — six shipped repositories, two under development
- [x] Read `information/resetup_resume.pdf` — extracted with `pdftotext`; confirms
      the profile, skills, projects and education already in the data layer
- [x] Inspect all nine files the owner supplied — dimensions, alpha, and subject
      identified for each by opening them, not by reading filenames

### 13.2 Asset pipeline

- [x] Add `scripts/build-assets.py` — derives one WebP per original into
      `src/assets/images/`; the source PNGs are never modified
- [x] Crop the portrait to head, shoulders and upper chest for the hero
- [x] Derive a square face crop for the footer pill, flattened onto the pill fill
- [x] Import every derivative through the data layer so Vite fingerprints it and
      a missing file fails the build rather than 404ing
- [x] Result: ~10 MB of PNG reduced to ~390 KB of WebP with no dimension loss

### 13.3 Content integration

- [x] `assets.js` — portrait and avatar wired; `contactBackground` still null
- [x] `projects.js` — five real captures wired; two new projects added from
      `information/project.js` (FOSS Club, Furniture Display); tool lists
      reconciled with the stacks recorded there
- [x] `services.js` — each panel's work sample is a shipped project that
      exercises that service; the card is decorative and `aria-hidden`
- [x] `experience.js` — the two entries with a shipped interface carry its capture
- [x] `socials.js`, `profile.js` — unchanged; already the owner's real record
- [x] Verified every outbound URL. Two repositories named in
      `information/project.js` return 404 unauthenticated, so those two projects
      ship without a `Live Preview` button rather than with a dead link

### 13.4 Fit, composition and covers

- [x] `MediaFrame` gains `fit`, `position` and `fallback`; existing defaults unchanged
- [x] **Reworked after review.** The first pass cropped the tall captures into
      the landscape frames and it read as a mistake - devices sliced in half,
      headlines cut mid-word. `scripts/build-assets.py` now samples each
      capture's ground colour, trims to the device's true bounding box, and
      re-composes it whole and centred at 1280 x 720, so the frame has nothing
      to cut but ground. Card, service and experience frames all use it
- [x] Detail frames use `contain` on the capture itself, at full size
- [x] Build `ProjectCover` for the five projects with no capture - a typographic
      cover from the project's own name and stack, reusing the site's ghost-plus
      -solid pairing. A stock photograph was rejected: a card in Selected Work
      reads as a picture of the thing that was built
- [x] Hero portrait: below `lg` it leaves the absolute layer and sits in flow, so
      a face and a patterned shirt no longer sit behind the role paragraph and
      the social pills
- [x] Role block measure narrowed at `lg` and above so the intro clears the
      cutout's shoulder line — measured, not eyeballed
- [x] Portrait desaturated to 0.85 so the one saturated element on the page sits
      inside the monochrome palette (rule.md Rule 2)
- [x] Neutral frames relabelled from "Preview pending" to the subject's own name

### 13.5 Verification

- [x] Headless Chrome over CDP against the production build on both routes
- [x] Console: no errors, warnings or exceptions on any route or viewport
- [x] Network: no failed requests, no 4xx, no broken image
- [x] Horizontal overflow: none at 1920, 1440, 1280, 1024, 768, 430, 375, 360
- [x] Heading outline verified: one `h1`, no skipped levels
- [x] Reduced motion: full sweep repeated with `prefers-reduced-motion: reduce`
      emulated; every section renders complete and legible
- [x] Entrance timing sampled per frame — nav ~0 ms, wordmark ~200 ms,
      role and rail ~580 ms, portrait ~1150 ms, matching design.md 18
- [x] Reference video decoded through the browser (no ffmpeg available) and the
      entrance order confirmed against frames at t=0.9/1.3/1.8/2.6
- [x] Experience pointer-follow preview verified with a synthesised pointer
- [x] Side-by-side against `home.webp`, `project.webp`, `service.webp`,
      `contact.webp` at 1440 x 982
- [x] `npm run lint`, `npm run format:check`, `npm run build`

### 13.6 Open items

All six were closed in Phase 14. Kept here with their outcome rather than
deleted, so the reasoning stays attached to the question.

- [x] `yarnvia.png` **is** an e-commerce interface — resolved on the capture's
      own evidence, not on resemblance. See Phase 14.1.
- [x] `ats.png` — **stays unused.** See Phase 14.2.
- [x] `petai` and `Real_Estate_Agent` remain out of the grid, for the same
      reason. See Phase 14.2.
- [x] The originals **moved out of `public/`** to `information/source-assets/`.
      See Phase 14.4.
- [ ] Two repositories are private or unpushed: `Foss-webpage-` and
      `furniture-landing-page`. Making them public restores both Live Preview
      buttons with no code change. **Still open — the owner's call, not a code
      change.**
- [x] FastAPI Authentication Microservice, Smart Queue Management System and
      Kids Garden stay out of the grid. See Phase 14.3.

---

## Phase 14 — Production Hardening

Taking the verified Phase 13 implementation to a deployable state. No rewrite,
no redesign, no architectural change: the component tree, the animation
pipeline, the data layer and every measured dimension are untouched. Every box
below was checked against a command that was actually run or a measurement taken
in headless Chrome over CDP against the **production build** served by
`npm run preview`.

### 14.0 Baseline (recorded before any change)

- [x] `npm run lint` — exit 0, no warnings
- [x] `npm run format:check` — exit 0
- [x] `npm run build` — exit 0, 158 modules, 2.44 s
- [x] `dist/` total **10,859,961 bytes**, of which **9,954,733 bytes** were the
      seven source PNGs copied verbatim out of `public/`
- [x] JS 371,682 / CSS 32,151 / WebP 499,818 / HTML 1,245 bytes

### 14.1 Yarnvia classification — resolved, kept and made specific

- [x] Opened `information/source-assets/yarnvia.png` rather than reasoning from
      its filename. It is an apparel storefront under a **Yarnvia** wordmark:
      search placeholder ("Shirts, Hoodies, Jeans"), a Shop All / Men / Women /
      Children category row, a featured collection, a cart with a badge count,
      and a Home / Shop / Orders / Cart tab bar. The e-commerce classification
      is established by the capture, not inferred from a resemblance
- [x] Confirmed against `information/resetup_resume.pdf`: it records exactly one
      e-commerce project, "Scalable E-commerce Platform — Production
      Application", ~1,000 requests/hour, a reported 20 percent growth
      improvement
- [x] Confirmed `information/project.js` does **not** list Yarnvia at all, so no
      source names the capture and the résumé entry together
- [x] **Outcome:** the résumé's title and figures are kept verbatim — they are
      the owner's own record — and the project is now named `Yarnvia`, as the
      capture names it, so the pairing is visible and checkable instead of
      hidden behind an anonymous "E-commerce Platform". The residual inference
      is written into `projects.js` above the entry (rule.md Rule 22). Slug
      unchanged. Card geometry unchanged — measured: all ten cards remain
      524 × 473 with one-line titles

### 14.2 ATS — resolved, stays out

- [x] Opened `information/source-assets/ats.png`: an ATS Kingston Heath
      (Sector 150, Noida) site-visit enquiry page — name and contact-number
      fields, a Send Enquiry button, call and WhatsApp affordances
- [x] Matched to the `Real_Estate_Agent` repository, which
      `information/project.js` files under `projectUnderDevelopment`, with a
      second contributor and **no tech stack recorded**
- [x] **Outcome: not added.** All three of the brief's exclusion conditions
      hold — under development, collaborative, and no shipped status
      establishable from any source. Selected Work also has no in-progress
      state: the reference's badge vocabulary is `Real Project` and
      `Exploration`, both of which read as finished, and adding a third would be
      inventing design rather than reproducing it. Documented in `projects.js`
      and design.md §21 item 3. Introducing one is a design.md change first,
      a data change second
- [x] `petai` excluded on the same evidence

### 14.3 Missing résumé projects — resolved, stay out

- [x] FastAPI Authentication Microservice, Smart Queue Management System and
      Kids Garden reviewed against the brief's criteria
- [x] Absence of a capture is **not** the reason — Code RAG, Deploy Platform and
      ORBII have none either and ship on `ProjectCover`
- [x] **Outcome:** curation. The reference grid presents a chosen subset; this
      array is already ten entries against its four; and all three omitted are
      backend services whose territory (JWT/RBAC auth, Redis queueing, FastAPI
      CRUD) is already represented by ShipBihar and Code RAG. Adding them would
      lengthen the grid without widening it. Reason recorded in `projects.js`;
      a data-only change if the owner disagrees

### 14.4 Asset pipeline — the 10 MB fixed

- [x] Searched the whole repository for every one of the seven filenames. The
      only non-documentation reference is `scripts/build-assets.py`; no runtime
      code, no JSX, no data file and no `index.html` touches them
- [x] `git mv` moved all seven from `public/` to `information/source-assets/`,
      so history follows them and nothing was deleted
- [x] `scripts/build-assets.py` now reads from a single `SRC` constant;
      docstring rewritten to record why
- [x] Re-ran the pipeline and verified all **twelve derivatives are
      byte-identical** by md5 — the move cannot have changed a pixel
- [x] `public/` now holds `favicon.svg` and `robots.txt` only
- [x] `dist/` **10,859,961 → 907,775 bytes (−91.6 %)**; media in `dist/`
      unchanged at 499,818 bytes of WebP
- [x] Production network audit: **zero `.png` requests** on any route
- [x] CLAUDE.md §3, rule.md Rule 21, design.md §20.1 and README.md updated in
      the same change (CLAUDE.md §20)

### 14.5 Image optimisation audit

- [x] Every shipped image inventoried at runtime: natural size, CSS size,
      format, `loading`, `fetchpriority`, and whether it is above the fold
- [x] Hero portrait: `loading="eager" fetchpriority="high"`, correctly **not**
      lazy — it is on the LCP path and part of the entrance timeline
- [x] Every other image `loading="lazy"`; verified by scrolling the full page
      and re-reading: all resolve, **zero broken**
- [x] Every `img` carries explicit `width` and `height`; `MediaFrame` sets the
      aspect ratio on the frame, so the box reserves its space before decode.
      No layout shift from images
- [x] No oversized asset: the largest on-page use of a capture is the detail
      frame at roughly 460 × 830 CSS px, so the source doubles as the 2× asset
- [x] No duplicate and no unused generated asset — all twelve derivatives are
      imported and all twelve are emitted
- [x] The hero's colour-wipe layer reuses the portrait's own URL, so it costs a
      decode rather than a second download

### 14.6 HTML, SEO and social metadata

- [x] `lang="en"`, `charset`, `viewport`, `theme-color`, favicon, title and
      description all present and carrying the owner's real identity
- [x] Added `author`, `og:type`, `og:site_name`, `og:title`, `og:description`,
      `og:locale`, `twitter:card`, `twitter:title`, `twitter:description`
- [!] `og:url`, `rel="canonical"` and `og:image` **deliberately omitted** — all
      three need the deployment domain, which is not decided, and the Open Graph
      spec requires an absolute image URL. `twitter:card` is `summary` rather
      than `summary_large_image` for the same reason. Nothing was invented; the
      reasoning is a comment in `index.html` and a note in README.md
- [x] `robots.txt` verified: `User-agent: *` / `Allow: /`
- [x] **Per-route document titles added** (`useDocumentTitle`). Previously all
      three routes announced themselves as the home page, which fails
      WCAG 2.4.2 — a screen reader reads the title first on every navigation.
      Verified live: `/` → "Vishnu Bhardwaj - Backend Developer",
      `/project/shipbihar` → "ShipBihar - …", `/no-such-page` → "Page not found
      - …". Labelled in the hook as an accessibility requirement rather than
      observed behaviour (rule.md Rule 4)

### 14.7 Semantic HTML and accessibility

- [x] Landmarks per route: home `header`/`nav`/`main`/`footer` = 1/1/1/1;
      detail 0/0/1/1 (correct — the detail route has no nav)
- [x] Exactly **one `h1` per route**, on all five routes tested
- [x] **No skipped heading levels** on any route
- [x] Zero `div[onclick]` / `span[onclick]`; every control is a real `<button>`
      or `<a>`
- [x] Zero focusable elements inside `aria-hidden` subtrees
- [x] Zero images without an `alt` attribute; decorative layers carry `alt=""`
      inside `aria-hidden` wrappers
- [x] Zero unnamed focusable elements
- [x] **Contrast measured programmatically** across every distinct
      text-on-background pair, resolving alpha through the ancestor chain:
      22 pairs on home, 16 on the detail route, **zero failures** against
      4.5:1 body / 3:1 large. Lowest real pair is the nav counter at 4.97:1
- [x] One contrast fix shipped: the `@supports not (-webkit-text-stroke)`
      fallback for the outlined wordmark blended to **2.29:1**, under the 3:1
      large-text minimum. Raised from `opacity: 0.35` to `0.5` (3.55:1). Affects
      only engines without `-webkit-text-stroke`; no visual change anywhere else
- [x] One target-size fix shipped: `focus:not-sr-only` resets `padding` to `0`,
      so the focused skip link rendered as a **78 × 26** block with the text
      flush against its edge. Restated the box under the focus variant — now
      **118 × 44**
- [x] Touch targets: at 768 / 430 / 375 px every interactive element is at least
      44 × 44 except the skip link, which is now exactly 44 tall. Mobile menu
      links measure 48 px. The desktop nav links are 24 px tall at 1024 px and
      above, which is mouse-only territory and meets WCAG 2.5.8's 24 × 24
      minimum; their height is set by the reference's type scale (rule.md
      Rule 2) [measured, not changed]
- [x] `web-design-guidelines` still not run — the skill fetches its rules from
      raw.githubusercontent.com and no network access was available. CLAUDE.md
      §10 used as the documented fallback, as in Phase 11

### 14.8 Keyboard

- [x] Full Tab traversal of the home route with synthesised key events:
      **32 stops**, logical order (skip link, nav, CTAs, rail, filters, cards,
      service triggers, contact, footer), wrapping cleanly to the document.
      **No keyboard trap**
- [x] **Every one of the 32 stops shows a visible focus indicator** under real
      keyboard focus — verified by reading computed `outline` and `box-shadow`
      at each stop with `:focus-visible` confirmed active
- [x] Service accordion operates from the keyboard: a `<button>` with
      `aria-expanded` flipping true/false and the panel collapsing to 0
- [x] Project filters operate as real `<button>`s and write `?filter=` to the
      URL; reloading `/?filter=Exploration` restores 4 of 10 cards
- [x] Mobile disclosure at 430 px: `inert` while closed (height 0, links out of
      the tab order), `aria-expanded` correct, links 48 px tall, **Escape closes
      it and returns focus to the trigger**

### 14.9 Reduced motion

- [x] Re-run with `prefers-reduced-motion: reduce` forced at the browser level,
      on both routes, before and after a full-page scroll
- [x] **Zero elements stranded at opacity 0**; zero elements left translated off
      position; zero infinite animations running
- [x] Every element carrying inline `opacity: 0` is an `aria-hidden` decorative
      follower (the ten card arrow buttons, the experience previews, the hero
      colour curtain) — all authored hidden by design
- [x] Zero console output and zero failed requests under reduced motion
- [x] Anime.js is genuinely disabled, not merely CSS transitions: every entry
      point bails on `shouldReduceMotion()` before creating a scope

### 14.10 Anime.js audit

- [x] Grepped `anime(`, `anime.default`, `anime.stagger` and `easing:` across
      `src/` — **zero hits.** No v3 API anywhere
- [x] Every `animejs` import is v4: `animate`, `stagger`, `createScope`,
      `createTimeline`, `createAnimatable`, `utils`
- [x] Zero `animate()` calls outside `src/animations/` and `src/hooks/`
- [x] Zero `document.querySelector` / `getElementById` outside `main.jsx`'s
      React root mount; every animation is scoped to a ref
- [x] Zero `window.addEventListener('scroll')`; scroll work is
      `IntersectionObserver`
- [x] Every scope reverts on unmount; every listener is removed in the same
      cleanup. Confirmed by reading all six animation entry points
- [x] StrictMode safe: every effect's cleanup reverts its scope and removes its
      listeners, so the double-invoke leaves nothing behind. Verified live — the
      app runs under `React.StrictMode` with zero console output
- [x] Entrance sequence sampled per frame on the production build: order is
      **nav → wordmark → role + rail → portrait**, matching design.md §18 and
      the reference video. Elements sit in their authored final state until
      their tween starts, confirming Rule 7 at runtime

### 14.11 Pointer-follow performance

- [x] Instrumented `getBoundingClientRect` and swept a synthesised pointer
      320 px across an experience row: **1 layout read on `pointerenter`, 0
      across 40 subsequent moves.** No layout thrashing
- [x] **0 non-style DOM mutations** under the section during the sweep — the
      move handler triggers no React re-render
- [x] Follower returns to opacity 0 on `pointerleave`
- [x] Listeners are added on the container only and removed in the effect
      cleanup
- [x] Touch: emulated a coarse pointer at 430 px —
      `(hover: hover) and (pointer: fine)` is false, the hook returns before
      binding anything, and the hero colour curtain stays at opacity 0
- [x] Damping is `createAnimatable`, not a hand-rolled RAF loop (rule.md Rule 5)

### 14.12 Responsive final pass

- [x] Measured `documentElement.scrollWidth` against `clientWidth` at
      **1920 / 1440 / 1280 / 1024 / 768 / 430 / 375 / 360** on all five routes:
      **zero horizontal overflow anywhere**
- [x] Measured, not eyeballed — the check also reports which elements cross the
      viewport edge, and found none

### 14.13 Reference fidelity regression

Every design.md §6/§7 measurement re-taken on the production build at
1440 × 982 **after** all Phase 14 changes:

| Measure | design.md | measured | |
| --- | --- | --- | --- |
| Page gutter | 80 px | **80** | exact |
| WIDE column (nav, wordmark, services) | 1280 px | **1280** | exact |
| BASE column (hero lower row, footer) | 1216 px | **1216** | exact |
| NARROW column (projects grid) | 1104 px | **1104** | exact |
| PANEL (experience card) | full − 16 px | **x=16, w=1408** | exact |
| Projects grid gap | 56 px | **56** | exact |
| Projects grid columns | 2 | **524 + 56 + 524** | exact |
| Nav from viewport top | ~56 px | **56** | exact |
| Hero height | `100dvh` | **982** | exact |
| Display / body families | Oswald / Smooch Sans | **as specified** | exact |
| Hero wordmark top | ~232 px | **203** | −29, pre-existing |
| Service collapsed row pitch | ~188 px | **182–183** | −5, pre-existing |
| Social rail pitch | ~79 px | **63** | pre-existing, 3 pills not 4 |

- [x] The three deviations are **Phase 13 state, not Phase 14 regressions.** No
      Phase 14 edit touches the hero wordmark, the service rows or the social
      rail; the rail difference follows from shipping three real destinations
      rather than padding to the reference's four with a dead link (Phase 1.1)
- [x] The one Phase 14 change with any visual surface is the Yarnvia card title.
      Measured: all ten cards remain 524 × 473 with 28 px one-line titles, so it
      changed no geometry
- [x] Asset derivatives byte-identical, so no image crop moved
- [x] Side by side against `inspiration/home.webp` at 1440 × 982: composition,
      nav, wordmark treatment, portrait anchoring, role block and rail all match

### 14.14 Video regression

- [x] Entrance order intact: **nav → wordmark → role / social rail →
      portrait**, then section reveals and interactive motion
- [x] Relative offsets and durations sampled per frame from the production build
      and consistent with design.md §18 (nav first and shortest, the rail
      travelling furthest of the lower band, the portrait starting last and
      settling roughly 850 ms later)
- [x] **No animation was added.** `useHeroEntrance` is byte-identical to Phase 13

### 14.15 Network and console

- [x] Production build served by `npm run preview` and inspected over CDP on
      five routes: `/`, three project routes, and an unknown slug
- [x] **Zero failed requests. Zero 4xx/5xx. Zero broken images. Zero `.png`
      requests.** 9–13 requests per route
- [x] **Zero uncaught exceptions, zero React errors, zero console warnings** on
      every route, at every viewport, before and after a full scroll, and under
      reduced motion. Nothing suppressed
- [x] An unknown slug renders `NotFound` with its own `h1` and title — no crash

### 14.16 Build output

| | baseline | after | |
| --- | --- | --- | --- |
| `dist/` total | 10,859,961 B | **907,775 B** | **−91.6 %** |
| source PNG in `dist/` | 9,954,733 B | **0** | removed |
| JS | 371,682 B | 372,093 B | +411 B (title hook, data guards) |
| CSS | 32,151 B | 32,475 B | +324 B (skip-link focus box) |
| WebP | 499,818 B | 499,818 B | unchanged — byte-identical |
| HTML | 1,245 B | 3,057 B | +1,812 B (OG tags and comment) |
| files | 27 | 21 | −6 |

- [x] Chunks are still `vendor` / `router` / `animation` / `index` /
      `ProjectDetail`, matching `vite.config.js`
- [x] No chunk-size warnings
- [x] No unused and no duplicate asset in `dist/`

### 14.17 Dependencies

- [x] Four runtime dependencies, all genuinely used: `react` (17 modules),
      `react-dom` (1), `animejs` (7), `react-router-dom` (5).
      `react-router-dom` was explicitly approved in Phase 1.1
- [x] Every devDependency is referenced by a script or a config
- [x] **`npm audit`: 0 vulnerabilities**
- [x] Nothing installed, nothing removed

### 14.18 Code quality

- [x] Grepped `TODO`, `FIXME`, `HACK`, `placeholder`, `Preview pending`,
      `lorem ipsum`, `example.com` and `test@test.com` across `src/`,
      `index.html`, `vite.config.js` and `scripts/`. Two hits, both legitimate
      prose ("rate table … refresh tokens", "every role using the token").
      **No production leftovers**
- [x] Removed one real leftover: `README.md` ended with a UTF-16LE fragment
      appended by a repository initialiser, rendering as mojibake
- [x] `Button`, `Card`, `appConfig`, `apiClient` and `src/utils/constants.js` are
      unused scaffold. **Kept**: rule.md Rule 18 names the primitives as
      preserved, CLAUDE.md §4 documents the placeholder layers, and all of it
      tree-shakes out — `http://localhost:3000` from `appConfig` appears nowhere
      in `dist/`
- [x] No unused import, no dead component, no duplicate data, no unreachable
      route

### 14.19 Error and empty states

- [x] Missing image: `MediaFrame` renders `ProjectCover` or a neutral frame at
      the correct ratio — exercised live by the five projects with no capture
- [x] Missing `liveUrl`: the Live Preview button is not rendered — exercised by
      six projects
- [x] Empty `images`: the detail showcase collapses instead of rendering empty
      frames
- [x] Missing experience media: the neutral frame carries the organisation's
      name
- [x] A filter matching nothing renders a deliberate empty state, not a blank gap
- [x] **Hardened:** `project.tags`, `project.tools` and `project.images` were
      mapped unguarded, so a record missing one would throw and take the whole
      grid down with it. They are now read through `?? []`. No fallback content
      is substituted — the list simply does not render

### 14.20 Deployment

- [x] `vite.config.js` unchanged and still correct; no `base` override needed
- [x] Asset paths in `dist/index.html` are absolute from root and resolve
- [x] No local filesystem reference, no development URL, no hardcoded secret and
      no API key in `src/`, `index.html` or `dist/`
- [x] Searched `dist/` for `localhost` and `127.0.0.1`: one hit, inside
      `react-router`'s own bundled fallback-origin helper. **Not ours** —
      `appConfig`'s localhost default is tree-shaken and absent
- [x] `.env` is gitignored and never committed; nothing it holds reaches the
      bundle
- [!] **SPA rewrite required at the host.** `createBrowserRouter` means
      `/project/<slug>` has no matching file in `dist/`, so a deep link or a
      refresh returns the host's own 404 unless unmatched paths are rewritten to
      `index.html`. `npm run preview` does this automatically, which is why it
      does not surface in local testing. Per-host recipes are in README.md; no
      config file is committed, because the host is not chosen and guessing one
      would ship dead configuration. **This is the one item between here and a
      working deploy, and it is a hosting setting rather than a code change**

### 14.21 Git hygiene

- [x] `dist/`, `node_modules/` and `.env` are gitignored and none is tracked
- [x] No log, screenshot, debug file or browser artefact is tracked. All test
      tooling was written to the session scratchpad, not the repository
- [x] The seven PNG moves are recorded as renames, so history follows them
- [x] No history was rewritten and no user file was deleted
- [ ] `src/assets/images/` is untracked and needs `git add` before the first
      deploy — the build imports it and the pipeline is manual, so it has to be
      in the repository. Not staged here: committing is the owner's call

### 14.22 Final validation

- [x] `npm run lint` — exit 0, no warnings
- [x] `npm run format:check` — exit 0
- [x] `npm run build` — exit 0
- [x] Production build served and exercised on all routes: runtime, network,
      console, images, responsive, accessibility, keyboard and reduced motion

---

## Deferred / Out of Scope

Not supported by the references; do not build without an explicit instruction:

- Sticky header, scroll-spy, scroll progress indicator
- Contact form, newsletter, comments
- Dark mode toggle (the site is light with one inverted section)
- Blog, CMS, i18n, analytics
- A `View All Work` index route — the button exists in the reference but its
  destination is never shown. Confirm the target before building it.
