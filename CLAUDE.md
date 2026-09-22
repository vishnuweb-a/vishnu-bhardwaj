# CLAUDE.md — Project Development Contract

This file is the **central development instruction and reference** for this
repository. Read it before implementing, modifying, redesigning, or reviewing
any feature. It takes precedence over general habits and over any individual
skill's opinions (see [§12 Skill Conflict Resolution](#12-skill-conflict-resolution)).

---

## 1. Project Overview

A personal portfolio site built as a production-grade React single-page
application. It is currently a scaffold: the architecture, animation layer,
tooling, and UI primitives are in place; the actual portfolio content
(home, projects, experience, services, contact) is not yet built.

Design references live in [inspiration/](inspiration/) — `home.webp`,
`project.webp`, `experience.png`, `service.webp`, `contact.webp`, and
`portfolio.annimation.mp4`. Consult them before designing new pages.

**Current state:**

- Single page (`Home`) rendered directly by `App.jsx`. No router installed.
- Three UI primitives: `Button`, `Card`, `Container`.
- Animation layer wired end to end and reduced-motion aware.
- `features/`, `store/`, `services/`, `lib/`, `providers/`, `routes/` exist as
  placeholders with documented intent. They are deliberately empty.

---

## 2. Technology Stack

| Layer | Choice | Version | Notes |
|---|---|---|---|
| Framework | React | ^19.2.8 | Function components + hooks only |
| Build tool | Vite | ^7.3.6 | `@vitejs/plugin-react` |
| Styling | Tailwind CSS | ^4.0.0 | Via `@tailwindcss/vite` — **CSS-first config** |
| Animation | Anime.js | ^4.5.0 | **The only animation library** |
| Linting | ESLint | ^8.57.0 | `.eslintrc.cjs`, legacy config format |
| Formatting | Prettier | ^3.2.5 | `.prettierrc` |
| Language | JavaScript (ESM) | — | **Not TypeScript.** `.js` / `.jsx` only |
| Node | — | >= 20.19.0 | npm >= 10 |

**Runtime dependencies are exactly three:** `react`, `react-dom`, `animejs`.
Keep it that way unless there is a real, argued need.

### Scripts

```
npm run dev           # Vite dev server on http://localhost:5173
npm run build         # Production build to dist/
npm run preview       # Serve the production build
npm run lint          # eslint src/
npm run format        # prettier --write "src/**/*.{js,jsx,css,json,md}"
npm run format:check  # prettier --check (this is what validation runs)
```

---

## 3. Architecture

### Import alias

`@` resolves to `./src` (configured in [vite.config.js](vite.config.js)).
Use `@/…` for cross-directory imports. Relative imports are acceptable only
within the same directory or feature.

### Animation data flow — do not deviate

```
React component
      ↓  useAnimation / useAnimationOnHover   (src/hooks/useAnimation.js)
      ↓  animation preset factory             (src/animations/presets/*)
      ↓  createAnimation / shouldReduceMotion (src/animations/utils/)
      ↓  Anime.js v4  (animate, createScope, stagger)
```

- Presets are **plain factory functions** returning an Anime.js v4 config
  object, spreading `...options` last so callers can override any field.
- `useAnimation` captures its config on first render and runs the animation
  **once on mount**, inside `createScope({ root })`, reverting on unmount.
  Re-triggering is intentionally out of scope — do not add it speculatively.
- `useAnimationOnHover` registers a scoped `run` method and returns
  `{ ref, onMouseEnter, onMouseLeave }` to spread onto an element.
- Every entry point checks `shouldReduceMotion()` and bails out. Elements are
  authored **in their final visual state**, so a skipped animation still leaves
  a correct, usable page. Preserve this invariant in every new animation.

### Asset pipeline

The owner's original media lives in `information/source-assets/` and is the
source of truth. It is never modified and never referenced directly by the
application.

```
information/source-assets/*.png   (originals, untouched, never served)
      |
      v  scripts/build-assets.py   (Pillow; run manually, not part of the build)
      |
src/assets/images/*.webp    (~390 KB total)
      |
      v  imported by src/features/portfolio/data/
      |
      v  Vite fingerprints and emits them
```

Importing through the data layer means a missing asset fails the build rather
than 404ing at runtime, and every file is content-hashed. Never add a raw
`/something.png` path to JSX or to a data file. `scripts/` is the only top-level
directory outside the settled `src/` structure and holds this one script.

**The originals are deliberately not in `public/`.** Vite copies `public/`
verbatim into `dist/`, so while they lived there roughly 10 MB of source PNG
shipped on every deploy that no page ever requests - the WebP derivatives are
the only media the site loads. Moving them out cut `dist/` from 10.4 MB to
0.87 MB with byte-identical derivatives (Phase 4, verified by checksum).
`public/` now holds only what must be served verbatim: `favicon.svg` and
`robots.txt`. Put nothing else there unless the browser needs to request it by a
literal path.

### Build chunking

[vite.config.js](vite.config.js) splits `vendor` (react, react-dom) and
`animation` (animejs) manual chunks. Adding a runtime dependency means deciding
where it chunks — another reason to avoid adding one.

### Styling

Tailwind v4 CSS-first. The single entry is
[src/styles/index.css](src/styles/index.css), which does
`@import 'tailwindcss';` and defines base-layer rules including a global
`prefers-reduced-motion` reset. **There is no `tailwind.config.js` and none
should be created.**

### Theming

The site has a light and a dark theme, driven by a `dark` class on `<html>`.

```
index.html inline bootstrap   sets the class before first paint
      ↓
.dark { … } in src/styles/index.css   rebinds the @theme colour tokens
      ↓
components                    already consume tokens, so they follow
```

Every colour in `@theme` is a **semantic token** (`--color-canvas`,
`--color-ink`, `--color-line`, …), never a palette value. That is what makes a
theme a stylesheet change: the `.dark` block rebinds the same names and the
components need no `dark:` variants. **Style new UI with these tokens.** A
hard-coded `bg-white` or `text-slate-900` cannot follow the theme and will
break dark mode.

- The `dark:` variant is redefined via `@custom-variant` to follow the class
  rather than `prefers-color-scheme`, so an explicit choice wins over the OS.
- Theme state lives in [src/hooks/useTheme.js](src/hooks/useTheme.js);
  the control is [src/components/ui/ThemeToggle.jsx](src/components/ui/ThemeToggle.jsx).
  There is no theme provider — the toggle is the only consumer (§19).
- Persistence is `localStorage` under `THEME_STORAGE_KEY`. Resolution order is
  **stored choice → OS preference → light**.
- The anti-flicker bootstrap in `index.html` must stay inline and synchronous
  in `<head>`. Anything async lands after the first paint and reintroduces the
  flash.
- The `panel` tokens are an inverted surface that stays dark in **both**
  themes. `bg-white/5` and `text-white` are correct on it and only on it.
- The dark grid background is the `.dark body` rule in
  [src/styles/index.css](src/styles/index.css) — `background-attachment: fixed`
  so it stays anchored while scrolling. Light mode has no grid.
- Theme-change transitions are gated behind a temporary `.theme-transition`
  class rather than applied permanently, so they do not slow every hover.

Dark colour values are chosen to meet contrast (4.5:1 text, 3:1 UI), not
picked from the palette by name — `ink-subtle` and `control` are both lighter
than their nominal zinc steps for that reason. Re-check contrast when changing
one.

---

## 4. Folder Structure

```
src/
├── app/                  Application shell
│   ├── App.jsx           Root component
│   ├── main.jsx          React DOM mount
│   ├── config/           appConfig, env-var reads
│   ├── providers/        AppProviders (placeholder passthrough)
│   └── routes/           Route table (placeholder — no router installed)
├── animations/           Centralized Anime.js layer
│   ├── presets/          fade, slide, scale, stagger
│   ├── utils/            createAnimation, shouldReduceMotion
│   └── index.js          Barrel export
├── assets/               Static assets imported by code
│   └── images/           WebP derived by scripts/build-assets.py
├── components/
│   ├── ui/               Generic primitives: Button, Card, Container,
│   │                     ThemeToggle
│   └── feedback/         Loading / Empty / Error / Success states (to build)
├── features/             Feature-oriented modules (empty; see §5)
├── hooks/                Shared hooks — useAnimation, useAnimationOnHover,
│                         useTheme
├── layouts/              MainLayout (header / main / footer)
├── lib/                  Shared libraries that fit nowhere else
├── pages/                Page components — Home/, NotFound/
├── services/             API layer — services/api/client.js
├── store/                Global state (empty; none installed)
├── styles/               index.css — the only global stylesheet
└── utils/                constants.js, helpers.js
```

**This structure is settled. Do not introduce new top-level `src/` directories
or rename existing ones without an explicit instruction from the user.**

---

## 5. Feature Architecture

Real product features go in `src/features/<feature-name>/`:

```
src/features/<feature-name>/
├── components/     Feature-specific UI
├── hooks/          Feature-specific hooks
├── services/       Feature-specific data access
├── utils/          Feature-specific helpers
├── pages/          Feature pages, if any
└── index.js        Barrel export — the feature's public surface
```

### The boundary rule

| Belongs in | What |
|---|---|
| `src/components/ui/` | Generic, business-logic-free primitives reusable by any feature |
| `src/features/<name>/components/` | Anything that knows about this feature's domain |
| `src/components/feedback/` | Generic Loading / Empty / Error / Success states |
| `src/pages/<Name>/` | Route-level composition; thin, composes features and layouts |

Never put feature-specific business logic in `src/components/ui/`.
Import across features only through the other feature's `index.js`.

---

## 6. Coding Standards

- **Function components with hooks.** No classes.
- **Named export + default export** for components, matching the existing files:
  `export const Button = …` followed by `export default Button;`
- **Barrel exports** (`index.js`) for each directory with a public surface.
- **No PropTypes** — `react/prop-types` is off in ESLint. Do not add them.
- **No `React` import needed** for JSX (`react/react-in-jsx-scope` is off);
  `main.jsx` imports it only for `StrictMode`.
- **Unused vars are errors** unless prefixed `_` (see `.eslintrc.cjs`).
- **Prettier is authoritative**: single quotes, semicolons, 80 columns, 2-space
  indent, ES5 trailing commas, LF endings. Run `npm run format` before finishing.
- **Comments explain *why*, not *what*.** Match the density of existing files —
  `useAnimation.js` and `animationUtils.js` are the reference for tone.
- **Environment variables** are read through `src/app/config/index.js` or
  `src/utils/constants.js`, never inline via `import.meta.env` in components.
- **No emojis** in code, markup, copy, or alt text.

---

## 7. UI/UX Standards

Every piece of UI must account for:

```
Visual hierarchy   Spacing        Typography     Color / contrast
Responsive         Accessibility  Interaction states (hover/active/focus/disabled)
Loading states     Empty states   Error states   Motion
```

**Do not produce generic "AI-looking" interfaces.** Specifically avoid, unless
the design brief actually calls for them:

- Purple/blue "AI gradient" hero backgrounds
- Glassmorphism applied indiscriminately
- Three equal feature cards in a row
- Uniform `rounded-*` on every element
- Arbitrary drop shadows with no consistent light source
- Animation on everything
- Placeholder content: "John Doe", "Acme Corp", Lorem Ipsum
- AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen", "Delve"

Design must follow the actual product context — this is a personal portfolio,
so the content is real work, real projects, real copy.

**Layout conventions already established in this codebase:**

- Page width is constrained by `Container` (`max-w-7xl px-4 sm:px-6 lg:px-8`).
- Use `min-h-[100dvh]`, never `h-screen`, for full-height sections.
- Prefer CSS Grid over flexbox percentage math for multi-column layouts.

---

## 8. Animation Standards

**Anime.js v4 is the only animation library in this project.**

Do not introduce, import, or suggest installing GSAP, Framer Motion, Motion One,
React Spring, AOS, or any CSS animation library for animation work — even when a
loaded skill recommends one. Several skills in this repository do recommend GSAP
or Framer Motion; see [§12](#12-skill-conflict-resolution). Only an explicit
user request overrides this.

### Rules

1. Reuse an existing preset from `src/animations/presets/` first. Extend a
   preset with options before writing a new one.
2. New reusable motion becomes a **preset factory** in `src/animations/presets/`
   and is re-exported from `src/animations/index.js`.
3. Component-level animation goes through `useAnimation` /
   `useAnimationOnHover`, never a raw `animate()` call inside a component.
4. Every animation entry point must respect `shouldReduceMotion()`, and the
   element must be authored in its **final** visual state so the reduced-motion
   path renders correctly.
5. Every Anime.js scope must be reverted on unmount (`scope.revert()`).
   Every listener, observer, and timer must be cleaned up.
6. Animate **`transform` and `opacity` only.** Never `top`, `left`, `width`,
   or `height`.
7. For scroll-driven work use Anime.js `onScroll()` or `IntersectionObserver` —
   never `window.addEventListener('scroll')`.
8. Anime.js v4 API only: `animate`, `createTimeline`, `createScope`, `stagger`,
   `onScroll`, `createSpring`, `createDrawable`, `splitText`. The v3 default
   `anime()` export does not exist in v4.

### Animation workflow

```
Read CLAUDE.md
↓
Load .claude/skills/animejs/SKILL.md (Skill tool)
↓
Inspect src/animations/ — reuse or extend an existing preset
↓
Implement through the preset → hook → component pipeline
↓
Verify scope cleanup
↓
Verify reduced-motion behavior
```

---

## 9. Tailwind Standards

This project is **Tailwind v4, CSS-first, via the Vite plugin**.

- **Never create `tailwind.config.js`.** All theme configuration goes in
  `src/styles/index.css` using `@theme { … }`.
- **Never mix v3 and v4 patterns.** No `@tailwind base/components/utilities`
  directives, no `postcss.config.js` with the `tailwindcss` plugin, no
  `content` array. v4 auto-detects content.
- Use `@import 'tailwindcss';` — a single global entry, already in place.
- Prefer utilities in `className`. Extract a small presentational component
  when class strings get unreadable — do not invent large custom CSS files.
- Avoid `@apply`; v4 discourages it. `src/styles/index.css` currently uses it
  once in the `body` base rule — do not expand that pattern.
- Use the built-in scale (`p-4`, `text-2xl`, `gap-6`) over arbitrary values.
  Arbitrary values are for genuine one-offs.
- **Complete class names only.** Never build them dynamically
  (`` `bg-${color}-500` `` will not compile). Use a lookup object or
  `bg-[var(--token)]`.
- v3→v4 renames to watch for: `bg-gradient-to-*` → `bg-linear-to-*`,
  `flex-shrink-0` → `shrink-0`, `flex-grow` → `grow`.
- If the design needs a token system, define semantic tokens in `@theme`
  (`--color-primary`, `--color-surface`, `--font-display`) rather than
  hard-coding `blue-600` / `slate-900` throughout components.

**shadcn/ui is not installed and this project is not TypeScript.** The two
shadcn skills describe a TypeScript + shadcn setup; treat their shadcn-specific
instructions as inapplicable here and use them only for their Tailwind v4
`@theme inline` / CSS-variable guidance.

---

## 10. Accessibility Standards

Every UI change must be checked against:

- **Semantic HTML** — `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`,
  `<article>`, real `<button>` and `<a>` elements. No div soup.
- **Keyboard navigation** — every interactive element reachable and operable.
- **Visible focus** — the existing pattern is
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`
  (see [src/components/ui/Button.jsx](src/components/ui/Button.jsx)). Never
  remove a focus indicator without replacing it.
- **ARIA only where semantics fall short.** Prefer native elements. The existing
  `aria-labelledby` on the features section in `Home.jsx` is the reference.
- **Color contrast** — 4.5:1 for body text, 3:1 for large text and UI borders.
- **Form labels** — every input has an associated `<label>`. Errors are inline
  and announced, never `window.alert()`.
- **Images** — meaningful images get descriptive `alt`; decorative ones get
  `alt=""`.
- **Reduced motion** — see §8. The global CSS reset in `src/styles/index.css`
  handles CSS transitions; JS animation is handled by `shouldReduceMotion()`.
- **Headings** form a correct outline; no level skipping.

Load `web-design-guidelines` for substantial UI/UX work (see §11).

---

## 11. Skill Registry

Skills live in two places, and they load differently:

| Location | How to load |
|---|---|
| `.claude/skills/<name>/` | Registered with Claude Code — invoke via the **Skill tool** |
| `.agents/skills/<name>/` | **Not** registered — load by **reading `SKILL.md` as a file** |

There are **21 skills**: 20 in `.agents/skills/`, 1 in `.claude/skills/`.
Provenance for most is recorded in [skills-lock.json](skills-lock.json).

---

### Tier 1 — Core skills for this project

These match the project's actual stack. Reach for these first.

#### animejs

**Path:** [.claude/skills/animejs/](.claude/skills/animejs/) — load via the **Skill tool** (`animejs`)
**References:** `references/api-reference.md` (complete v4 API),
`references/examples.md` (recipes: basic, stagger, timeline, scroll, SVG,
draggable, text, UI patterns, React integration, advanced)

**Purpose:** Complete Anime.js v4 reference — `animate`, `createTimeline`,
`createScope`, `stagger`, `onScroll`, easings, springs, SVG drawing/morphing,
`splitText`, draggable, WAAPI, and React integration.

**Use when:** any animation, transition, scroll-triggered reveal, hover
micro-interaction, timeline sequence, stagger, SVG animation, or motion system
work. **This is mandatory for every animation task in this project.**

**Load references when:** the `SKILL.md` sitemap does not already answer the
question — reach for `api-reference.md` for exact parameters and `examples.md`
for a working pattern to adapt.

**Do not use for:** styling, layout, or visual design decisions.

---

#### tailwind-v4-best-practices

**Path:** [.agents/skills/tailwind-v4-best-practices/](.agents/skills/tailwind-v4-best-practices/)
**References:** `references/design-tokens.md` (token architecture),
`references/theming.md` (dark mode, runtime switching),
`references/advanced-patterns.md` (animations, grid, container queries, custom
utilities, performance), `references/migration.md` (v3→v4)

**Purpose:** Production-grade Tailwind v4 with design-system thinking —
`@theme` configuration, semantic tokens, OKLCH color, v3→v4 renames, Vite setup.

**Use when:** writing or reviewing any Tailwind classes, building a design token
system, setting up theming/dark mode, or touching `src/styles/index.css`.

**This is the primary Tailwind authority for this project.**

**Do not use for:** shadcn-specific setup (not installed), or as a source of
animation implementation — animation belongs to `animejs`.

---

#### frontend-design

**Path:** [.agents/skills/frontend-design/](.agents/skills/frontend-design/)

**Purpose:** Aesthetic direction for new UI — a brainstorm → plan → critique →
build process that produces a compact token system (color / type / layout /
signature element) before any code is written. Includes strong guidance on
interface copywriting.

**Use when:** creating new pages or sections, choosing a visual direction,
selecting typography, or writing interface copy. Good default first read for
any greenfield UI on this project.

**Do not use for:** bug fixes, refactors, or purely structural work.

---

#### web-design-guidelines

**Path:** [.agents/skills/web-design-guidelines/](.agents/skills/web-design-guidelines/)

**Purpose:** Review UI code against Vercel's Web Interface Guidelines
(accessibility, UX, responsive behavior, interaction patterns).

**Use when:** auditing or reviewing UI, checking accessibility, or doing
substantial UI/UX work that needs a compliance pass.

**Note:** this skill works by **fetching** the live rules from
`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
via WebFetch. If network access is unavailable, fall back to the accessibility
checklist in §10 and say that the fetch did not happen.

---

#### redesign-existing-projects

**Path:** [.agents/skills/redesign-existing-projects/](.agents/skills/redesign-existing-projects/)

**Purpose:** Scan → diagnose → fix audit for upgrading an existing UI to premium
quality. A long checklist of generic patterns across typography, color, layout,
interactivity, content, components, iconography, code quality, and commonly
omitted essentials, plus a risk-ordered fix priority.

**Use when:** the user asks to "redesign this page", "improve this UI", "make
this more premium", "modernize this". **Inspect the existing implementation
first; do not rewrite from scratch.** Its own rules require working with the
existing stack and not breaking functionality.

**Do not use for:** greenfield UI (use `frontend-design`).

---

### Tier 2 — Visual direction skills (pick at most one)

These are mutually exclusive aesthetic systems. Selecting more than one produces
incoherent output. Choose based on the user's brief; if the brief does not name
a direction, ask or default to `frontend-design` alone.

#### high-end-visual-design

**Path:** [.agents/skills/high-end-visual-design/](.agents/skills/high-end-visual-design/)

**Purpose:** Agency-tier premium aesthetics — a "variance engine" of vibe and
layout archetypes, nested "double-bezel" card architecture, button-in-button
CTAs, macro-whitespace, custom cubic-bezier motion choreography, and explicit
performance guardrails.

**Use when:** building a premium landing page, hero, or marketing surface where
high visual fidelity is the point.

**Conflict:** recommends Framer Motion `whileInView` for scroll reveals.
**Use Anime.js `onScroll()` or `IntersectionObserver` instead** (§8). Its
`IntersectionObserver` recommendation is compatible; its Framer Motion one is not.

---

#### minimalist-ui

**Path:** [.agents/skills/minimalist-ui/](.agents/skills/minimalist-ui/)

**Purpose:** Editorial, document-style minimalism — warm monochrome palette,
typographic contrast, flat bento grids, muted pastel accents,
`1px solid #EAEAEA` borders, near-invisible shadows, quiet micro-motion.

**Use when:** the brief calls for clean, calm, editorial, Notion-like restraint.

**Conflict:** prescribes exact hex values. Translate them into Tailwind v4
`@theme` tokens rather than hard-coding hexes across components.

---

#### industrial-brutalist-ui

**Path:** [.agents/skills/industrial-brutalist-ui/](.agents/skills/industrial-brutalist-ui/)

**Purpose:** Swiss-print / tactical-terminal brutalism — rigid grids, extreme
type-scale contrast, utilitarian two-color palettes, zero border-radius, ASCII
framing, halftone and CRT scanline effects.

**Use when:** the user explicitly asks for a brutalist, technical, blueprint, or
terminal aesthetic.

**Do not use for:** anything else. It is a deliberate, committed direction and
deeply inconsistent with the rest of the visual skills.

---

#### design-taste-frontend

**Path:** [.agents/skills/design-taste-frontend/](.agents/skills/design-taste-frontend/)

**Purpose:** Anti-slop skill for landing pages, portfolios, and redesigns.
Starts with a "brief inference / design read", then three configurable dials
(variance, motion, density), a brief→design-system map, bias-correction
directives, an AI-tells blocklist, a redesign protocol, a block library, and a
pre-flight check. Appendices cover real design systems and canonical sources.

**Use when:** you want a rigorous, brief-first process for a portfolio or
landing page and an explicit anti-generic checklist to build against. Its scope
statement matches this project well (portfolios and landing pages).

**Do not use for:** dashboards, data tables, or multi-step product UI — it says
so itself.

**Conflict:** suggests icon and component libraries (Phosphor, Radix). This
project has three dependencies; do not install any of them without asking.

---

#### design-taste-frontend-v1

**Path:** [.agents/skills/design-taste-frontend-v1/](.agents/skills/design-taste-frontend-v1/)

**Purpose:** The original v1 of the skill above, preserved for backward
compatibility. Dial-based configuration (variance 8 / motion 6 / density 4),
architecture conventions, bias correction, AI-tells, creative arsenal, bento
motion paradigm, pre-flight check.

**Use when:** the user explicitly asks for v1 behavior.

**Never load alongside `design-taste-frontend`** — they are two versions of the
same skill and will conflict.

---

#### gpt-taste

**Path:** [.agents/skills/gpt-taste/](.agents/skills/gpt-taste/)

**Purpose:** Awwwards-level layout engineering — mandatory pre-flight
`<design_plan>`, pseudo-randomized layout selection, AIDA page structure, the
"2-line hero" rule, gapless `grid-flow-dense` bento grids, massive section
spacing, and a component arsenal.

**Use when:** you want its **layout, spacing, grid, and hero discipline** for a
marketing-style page.

**Major conflict — read before loading:** this skill mandates GSAP with
ScrollTrigger throughout (its Section 5) and forbids static interfaces.
**GSAP must not be used in this project.** Take its layout and typography rules;
implement every motion instruction it describes using the Anime.js layer in
`src/animations/` instead (§8). If you cannot separate the two cleanly, prefer
`high-end-visual-design` or `design-taste-frontend`.

---

#### stitch-design-taste

**Path:** [.agents/skills/stitch-design-taste/](.agents/skills/stitch-design-taste/)
**Reference:** `DESIGN.md` — a filled-in example output using the default dials

**Purpose:** Generates a `DESIGN.md` semantic design-system document for Google
Stitch, encoding atmosphere, color calibration, typography, component behavior,
layout, motion philosophy, and an anti-pattern list.

**Use when:** the user wants a written design-system document, or wants to drive
Google Stitch screen generation.

**Do not use for:** writing React implementation code. Its output is a document,
not an interface. Its bundled `DESIGN.md` is, however, a useful reference for
what a well-specified design system looks like.

---

### Tier 3 — Image and asset skills

**None of these write code.** They produce images, and they require an
image-generation capability to be available. If no image generation tool is
available in the session, say so rather than describing images you did not make.

Prefer existing project assets — [inspiration/](inspiration/) and
`information/source-assets/` — when they already satisfy the requirement. Do not
generate unnecessary images.

#### image-to-code

**Path:** [.agents/skills/image-to-code/](.agents/skills/image-to-code/)

**Purpose:** An **image-first** design-to-code workflow: generate large,
section-specific design reference images yourself, analyze them deeply (text,
typography, spacing, color, buttons, layout), then implement the frontend to
match. Includes hero minimalism rules, anti-nested-box rules, extraction
discipline, and section packs.

**Use when:** implementing a visually driven page where a reference image exists
or should be generated first — including when the user supplies a screenshot or
points at [inspiration/](inspiration/).

**Important:** despite the name, this skill's core mandate (its Section 2) is to
*generate* the reference image before coding. When the user has already supplied
a reference (as [inspiration/](inspiration/) does), skip generation and apply
its analysis and extraction rules (Sections 21–28) to the supplied image instead.

**Workflow for a supplied screenshot:**

```
Screenshot → analyze layout → typography → spacing → colors
→ responsive behavior → interactions → load required skills
→ implement as reusable React components (§4, §5) → validate
```

**Never trace pixels.** Build reusable React components.

---

#### imagegen-frontend-web

**Path:** [.agents/skills/imagegen-frontend-web/](.agents/skills/imagegen-frontend-web/)

**Purpose:** Art direction for generating **website section reference images** —
one horizontal image per section, composition variety, hero-scale variation,
consistent palette across the set.

**Use when:** the user asks for visual design references or comps for web
sections before implementation.

**Do not use for:** writing code, or generating production assets for the site.

---

#### imagegen-frontend-mobile

**Path:** [.agents/skills/imagegen-frontend-mobile/](.agents/skills/imagegen-frontend-mobile/)

**Purpose:** Generating premium **mobile app** screen and flow images (iOS /
Android), framed in device mockups.

**Do not use in this project.** This is a responsive **website**, not a mobile
app, and the skill explicitly states it is not for websites or landing pages and
that it does not write code. For responsive/mobile *behavior* of this site, use
`web-design-guidelines` plus §7 and §10 of this file.

---

#### brandkit

**Path:** [.agents/skills/brandkit/](.agents/skills/brandkit/)

**Purpose:** Generating premium brand-guideline boards, logo systems, identity
decks, and visual-world presentations as images.

**Use when:** the user asks for brand identity artwork, a logo system, or a
brand board.

**Do not use for:** UI implementation, or for picking the site's color and type
tokens — that is `frontend-design` plus `tailwind-v4-best-practices`.

---

### Tier 4 — Supporting / situational skills

#### busirocket-tailwindcss-v4

**Path:** [.agents/skills/busirocket-tailwindcss-v4/](.agents/skills/busirocket-tailwindcss-v4/)
**Rules:** `rules/tailwind-setup.md`, `rules/tailwind-class-strategy.md`,
`rules/tailwind-avoid-drift.md`, `rules/tailwind-css-ordering.md`

**Purpose:** A short, focused set of Tailwind v4 non-negotiables — single global
CSS entry, utilities over custom CSS, extract components rather than CSS files,
avoid style drift, CSS import ordering.

**Use when:** you need a quick styling-strategy check, or you are deciding
between a long utility string and extracting a component.

**Relationship to `tailwind-v4-best-practices`:** complementary and consistent.
The other skill is the deeper reference; this one is the short discipline list.
Loading both is fine. Its "Related Skills" pointer to `busirocket-react` refers
to a skill that **is not present** in this repository.

---

#### tailwind-v4-shadcn

**Path:** [.agents/skills/tailwind-v4-shadcn/](.agents/skills/tailwind-v4-shadcn/)
**References:** `references/architecture.md`, `references/common-gotchas.md`,
`references/dark-mode.md`, `references/migration-guide.md`
**Templates:** `templates/index.css`, `components.json`, `theme-provider.tsx`,
`utils.ts`, `vite.config.ts`, `tsconfig.app.json`

**Purpose:** Tailwind v4 + shadcn/ui setup — the four-step `@theme inline` /
CSS-variable architecture, automatic dark mode, known-gotcha prevention.

**Use when:** the user explicitly asks to add shadcn/ui, **or** when you need the
`@theme inline` + CSS-variable dark-mode pattern in isolation.

**Applicability caveat:** shadcn/ui is **not installed** here and this project is
**JavaScript, not TypeScript**. Its templates are `.ts`/`.tsx`. Adopt only the
CSS architecture; do not follow its install steps or copy its TS files without
an explicit request.

---

#### tailwind-css-v4-shadcn-ui

**Path:** [.agents/skills/tailwind-css-v4-shadcn-ui/](.agents/skills/tailwind-css-v4-shadcn-ui/)

**Purpose:** A shorter overview of the same territory — Tailwind v4 CSS-first
config plus shadcn/ui component usage, theming, and dark mode.

**Use when:** you want a quick orientation on Tailwind v4 + shadcn. Same
shadcn/TypeScript caveat applies.

**Overlap:** substantially overlaps `tailwind-v4-shadcn`. Load one, not both.

---

#### full-output-enforcement

**Path:** [.agents/skills/full-output-enforcement/](.agents/skills/full-output-enforcement/)

**Purpose:** Bans truncation and placeholder patterns — no `// ...`, no
`// TODO` stubs, no "rest follows the same pattern", no skeletons when a full
implementation was requested. Scope → build → cross-check process.

**Use when:** generating a large multi-file feature, or any time completeness
matters more than brevity.

**Note:** its principles already align with the Definition of Done (§16). Load
it explicitly when the deliverable is large enough that truncation is a real risk.

---

#### grill-with-docs

**Path:** [.agents/skills/grill-with-docs/](.agents/skills/grill-with-docs/)

**Purpose:** An adversarial interview to sharpen a plan or design, producing
ADRs and a glossary along the way.

**Use when:** the user explicitly invokes it. Its frontmatter sets
`disable-model-invocation: true` — **never load it on your own initiative.**

**Known limitation:** its body instructs calling two further skills, `grilling`
and `domain-modeling`, **neither of which exists in this repository.** Tell the
user this rather than improvising a substitute.

---

## 12. Skill Conflict Resolution

Skills disagree with each other. When they do, resolve in this order:

```
1. The user's explicit request
2. CLAUDE.md (this file)
3. The project's existing architecture and dependencies
4. The relevant specialized skill
5. General best practices
```

**A skill never overrides an explicit project architectural decision.**

### Standing conflicts in this repository

| Conflict | Resolution |
|---|---|
| `gpt-taste` mandates GSAP + ScrollTrigger | Anime.js only. Take its layout rules, implement motion via `src/animations/` |
| `high-end-visual-design` suggests Framer Motion `whileInView` | Anime.js `onScroll()` or `IntersectionObserver` |
| Several skills recommend Phosphor / Radix / Lucide icon packages | Do not install. Use inline SVG, or ask first |
| shadcn skills assume TypeScript + shadcn/ui | Project is JS with no shadcn. Take CSS architecture only |
| Skills prescribe specific fonts (Geist, Satoshi, Clash Display…) | Fine as a direction, but confirm the delivery mechanism before adding a font dependency or external stylesheet |
| Skills prescribe exact hex palettes | Translate into `@theme` tokens in `src/styles/index.css` |
| `design-taste-frontend` vs `design-taste-frontend-v1` | Same skill, two versions. Load exactly one |
| Multiple Tier-2 aesthetic skills at once | Pick one visual direction |
| Skills that ban `Inter` vs. skills that recommend it | Defer to the chosen Tier-2 direction, then to the user's brief |

If a skill recommends a library this project deliberately does not use, follow
the project's architecture and say what you skipped and why.

---

## 13. Skill Selection Matrix

| Task | Load |
|---|---|
| New UI page or section | `frontend-design` + `web-design-guidelines` + one Tier-2 direction |
| Any Tailwind class or `index.css` change | `tailwind-v4-best-practices` (+ `busirocket-tailwindcss-v4` for strategy) |
| Any animation, transition, scroll reveal, hover motion | **`animejs`** (Skill tool) — always |
| Premium landing page / hero / marketing surface | `high-end-visual-design` + `frontend-design` + `tailwind-v4-best-practices` |
| Portfolio or landing page, brief-first process | `design-taste-frontend` |
| Minimal / editorial / calm direction | `minimalist-ui` |
| Brutalist / technical / terminal direction | `industrial-brutalist-ui` |
| Awwwards-style layout & grid discipline | `gpt-taste` (motion via Anime.js — see §12) |
| Redesign / "make this more premium" / modernize | `redesign-existing-projects` + one Tier-2 direction |
| Screenshot or reference image → React | `image-to-code` + `frontend-design` |
| Generating web section design references | `imagegen-frontend-web` |
| Brand board / logo system / identity artwork | `brandkit` |
| Writing a design-system document | `stitch-design-taste` |
| Accessibility audit / UI review | `web-design-guidelines` |
| Adding shadcn/ui (only if the user asks) | `tailwind-v4-shadcn` |
| Large multi-file generation | `full-output-enforcement` |
| Adversarial plan review (user-invoked only) | `grill-with-docs` |
| Bug fix, refactor, config change, dependency work | **No skill.** Follow this file |
| Mobile app screens | **No applicable skill** — this is a website |

---

## 14. Mandatory Feature Development Workflow

Whenever the user asks to create, modify, redesign, or implement a feature:

```
USER REQUEST
     ↓
Read CLAUDE.md
     ↓
Understand project architecture
     ↓
Identify feature type
     ↓
Identify required skills          ← §13 Skill Selection Matrix
     ↓
Load required SKILL.md files      ← Skill tool for .claude/, file read for .agents/
     ↓
Read relevant references if required
     ↓
Inspect existing implementation   ← src/, package.json, vite.config.js
     ↓
Create implementation plan
     ↓
Implement feature
     ↓
Run validation                    ← §15
     ↓
Review against CLAUDE.md          ← §16 Definition of Done
     ↓
Finish
```

**Never go straight from user request to code.**

### Mandatory skill loading rule

> Before implementing a feature, determine whether an existing project skill
> applies. If a relevant skill exists:
>
> 1. Load its `SKILL.md`.
> 2. Follow its instructions, subject to §12.
> 3. Load its references only when actually needed.
> 4. Implement the feature according to the skill.

Load only the skills the task needs. Do not load every skill in the repository —
loading unrelated skills wastes context and produces conflicting direction.

### Worked example — animation request

> *"Add a smooth scroll reveal animation to the project cards."*

```
Read CLAUDE.md
     ↓
Identify: animation task (existing component, no new visual direction)
     ↓
Load .claude/skills/animejs/SKILL.md via the Skill tool
     ↓
Consult references/examples.md → "Scroll Animations" if needed
     ↓
Inspect src/animations/ — is there a preset to reuse or extend?
     ↓
Inspect src/hooks/useAnimation.js — does an existing hook cover this,
or is a scroll-aware hook needed?
     ↓
Implement: preset in src/animations/presets/, consumed through a hook
     ↓
Verify scope cleanup and reduced-motion behavior
     ↓
Validate (§15)
```

Do **not** invent a parallel animation architecture, call `animate()` directly
inside a component, or reach for a different library.

### Worked example — multi-skill request

> *"Create a premium responsive landing page with animated sections."*

Load: `frontend-design` + `high-end-visual-design` + `web-design-guidelines`
+ `tailwind-v4-best-practices` + `animejs`.

Do **not** additionally load `minimalist-ui`, `industrial-brutalist-ui`,
`gpt-taste`, `brandkit`, or the imagegen skills — they are either a competing
visual direction or irrelevant to the task.

---

## 15. Validation Workflow

Every implementation ends with validation. At minimum, actually run:

```bash
npm run lint
npm run format:check
npm run build
```

If `format:check` fails, run `npm run format` and re-check.

If the change affects runtime behavior, also:

```bash
npm run dev
```

and verify the affected route or component.

If browser tooling is available, inspect: console errors, network failures,
runtime exceptions, responsive layout at mobile/tablet/desktop widths,
animation behavior, and reduced-motion behavior with the OS setting enabled.

**Never claim visual or browser verification that did not happen.** If no
browser was available, say so explicitly. **Never claim a validation command
passed unless it was actually executed** and its output was read.

---

## 16. Definition of Done

A feature is not done because the code was written. It is done when:

```
[ ] CLAUDE.md was consulted
[ ] Relevant skills were identified via §13
[ ] Relevant SKILL.md files were actually loaded
[ ] Existing architecture (§3, §4, §5) was respected
[ ] Feature was implemented completely — no stubs, no TODOs, no placeholders
[ ] Existing functionality was preserved
[ ] Responsive behavior was considered and implemented
[ ] Accessibility (§10) was considered and implemented
[ ] Animations respect reduced motion and clean up their scopes (§8)
[ ] No unnecessary dependencies were added (§18)
[ ] npm run lint passes
[ ] npm run format:check passes
[ ] npm run build passes
[ ] Runtime behavior was verified where possible — and stated honestly where not
```

---

## 17. Forbidden Behaviors

- Jumping from a user request straight to code without consulting this file.
- Implementing a feature that a skill covers without loading that skill.
- Loading skills the task does not need.
- Introducing GSAP, Framer Motion, Motion One, or any other animation library.
- Calling Anime.js `animate()` directly inside a component instead of going
  through `src/animations/` and `src/hooks/`.
- Creating `tailwind.config.js`, or mixing Tailwind v3 and v4 patterns.
- Converting files to TypeScript, or adding `.ts` / `.tsx` files.
- Adding new top-level `src/` directories or renaming existing ones.
- Putting feature-specific business logic in `src/components/ui/`.
- Installing a package because a skill mentions it.
- Modifying, deleting, or "improving" any file under `.agents/skills/` or
  `.claude/skills/`.
- Editing `skills-lock.json` by hand.
- Removing a focus indicator, or shipping an animation with no reduced-motion path.
- Animating `top`, `left`, `width`, or `height`.
- Using `h-screen` for full-height sections (use `min-h-[100dvh]`).
- Emojis in code, markup, copy, or alt text.
- Placeholder content or AI copywriting clichés in shipped UI.
- Claiming a validation command passed, or a visual check happened, when it did not.
- Truncating an implementation with `// ...` or "the rest follows the same pattern".

---

## 18. Dependency Rules

Before installing anything, answer in order:

1. **Does the project already solve this?** (`src/animations/`, `src/hooks/`,
   `src/utils/helpers.js`, `src/components/ui/`, Tailwind utilities)
2. **Does an existing dependency solve it?** React 19, Anime.js v4, and
   Tailwind v4 cover far more than they are currently used for.
3. **Only then** consider a new package — and ask the user first.

**Never install a package because a skill mentions it.** The skills in this
repository collectively recommend GSAP, Framer Motion, shadcn/ui, Phosphor
Icons, Radix Icons, Zustand, and several font packages. None of those are
project decisions.

This project ships **three runtime dependencies**. Keep it dependency-light.

---

## 19. Do Not Over-Engineer

Do not create abstractions before they are needed. Do not add generic hooks,
services, managers, providers, or utilities without a real, present use case.

The placeholder directories (`store/`, `services/`, `providers/`, `routes/`,
`lib/`, `features/`) exist to mark *where* things go when they are needed —
they are not a to-do list. Fill them when a feature actually requires it.

Prefer simple code. Architecture should evolve with the product.

Concretely: do not install a router until there is more than one page; do not
add a state library until prop-drilling is a real problem; do not build a theme
provider until there is a second theme.

---

## 20. Documentation Rules

**When a major architectural decision is introduced** — a new dependency, a
router, a state library, a new layer in the animation pipeline, a change to the
folder structure — update this file (and [README.md](README.md) where the two
overlap) in the same change.

**When a new skill is added** to `.agents/skills/` or `.claude/skills/`, add a
registry entry (§11) with:

```
Skill name
Path
Purpose
When to use
When NOT to use / conflicts
```

Do not duplicate the skill's contents into this file. The registry points; the
skill explains.

---

## 21. Skill Registry Maintenance

```
When a new skill is added:
→ inspect its SKILL.md
→ determine purpose, triggers, and conflicts with §8 / §9 / §18
→ add it to the registry (§11) and the matrix (§13)

When a skill is removed:
→ remove it from the registry and the matrix

When a skill changes significantly:
→ re-read it and update its registry entry

Never reference a skill that does not exist.
```

Before relying on any registry entry, confirm the path still exists. The
registry is only useful while it matches the repository.

**Current count: 21 skills — 20 in `.agents/skills/`, 1 in `.claude/skills/`.**
Last verified: 2026-08-25.
