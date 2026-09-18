# Design Specification

Visual and interaction specification for the portfolio reconstruction.

**Scope of this document:** what the interface looks like and how it behaves.
Implementation sequencing lives in [plan.md](plan.md), verification in
[test.md](test.md), and implementation constraints in [rule.md](rule.md).
Project-wide architecture and skill rules remain in [CLAUDE.md](CLAUDE.md) and
are not repeated here.

---

## 1. Design Goal

Reproduce the reference portfolio's visual structure, layout, spacing,
typography, colour, component hierarchy, motion language and interaction
behaviour as accurately as the evidence supports, implemented as a
production-grade React application on the existing stack (React 19, Vite 7,
Tailwind v4 CSS-first, Anime.js v4).

This is a **reproduction**, not a reinterpretation. Where a project skill and
the reference disagree on an aesthetic point, the reference wins
(CLAUDE.md §12, resolution order 1 → 2).

**Content is not part of the reproduction.** The reference is a real
designer's portfolio. The layout, motion and component system are the
deliverable; every name, project, role, date and line of copy must be replaced
with the site owner's real content before the site ships (CLAUDE.md §7,
[rule.md](rule.md) Rule 16).

---

## 2. Reference Sources

| File                                   | What it shows                               | Fidelity                        |
| -------------------------------------- | ------------------------------------------- | ------------------------------- |
| `inspiration/home.webp`                | Hero, settled state, 1024×768               | Static, presentation-framed     |
| `inspiration/service.webp`             | Services accordion, one row expanded        | Static, background composited   |
| `inspiration/project.webp`             | Selected Work grid, one card hovered        | Static, presentation-framed     |
| `inspiration/experience.png`           | Experience panel, one row hovered           | Static, 752×564                 |
| `inspiration/contact.webp`             | Contact CTA + footer                        | Static, presentation-framed     |
| `inspiration/portfolio.annimation.mp4` | 21.57 s, 60 fps, 1566×1080 screen recording | **Behavioural source of truth** |

Note the file on disk is `portfolio.annimation.mp4` (double `n`), not
`portfolio.animation.mp4` as written in some briefs.

### Measurement basis

All CSS pixel values in this document are normalised to a **1440 × 982
viewport**, which is what both reference sets resolve to:

- Static `.webp` screenshots: browser viewport occupies x 78–948 of the 1024 px
  image → scale factor **1.6552**.
- `experience.png`: viewport occupies x 50–702 of 752 px → scale factor **2.2086**.
- Video frames: viewport occupies x 126–1442 of 1566 px → scale factor **1.0942**.

Values below are marked **[measured]** when derived from pixel analysis of the
references and **[inferred]** when reasoned rather than observed. Never
present an inferred value as measured.

---

## 3. Visual Identity

A monochrome editorial portfolio. The personality comes from three moves and
nothing else:

1. **Oversized display typography** — the name fills the hero edge to edge, one
   half outlined and one half solid; section headings are set at display scale.
2. **Ghost watermarks** — each section carries its own name as a very large,
   very low-contrast word sitting behind the real heading (`PORTFOLIO`,
   `SERVICE`, `EXPERIENCE`).
3. **Pill geometry** — every discrete control is a full-radius pill: the
   availability badge, nav CTA, social links, tags, filters, buttons.

Everything else is deliberately quiet: near-white page, near-black ink, hairline
rules, one dark inverted section, and exactly one chromatic accent (the green
availability dot).

There are no gradients on interface elements, no glassmorphism, no coloured
sections, and no shadow system beyond a barely-visible ambient shadow on
floating pills and media.

---

## 4. Colour System

All values **[measured]** from the references unless noted. Define these as
Tailwind v4 `@theme` tokens in `src/styles/index.css`; never hard-code them in
components (CLAUDE.md §9).

| Token                    | Value     | Measured from          | Use                                    |
| ------------------------ | --------- | ---------------------- | -------------------------------------- |
| `--color-canvas`         | `#FCFCFC` | hero background mode   | Page background                        |
| `--color-surface`        | `#F4F4F4` | project card body      | Cards, chips-on-white                  |
| `--color-surface-raised` | `#FFFFFF` | social/filter pills    | Floating pills, framed media           |
| `--color-ink`            | `#242424` | `ALFIN` glyph fill     | Display type, primary text             |
| `--color-ink-muted`      | `#545454` | hero body copy         | Body copy, descriptions                |
| `--color-ink-subtle`     | `#AAAAAA` | nav counts `[40]`      | Meta, counters, labels                 |
| `--color-ink-ghost`      | `#F4F4F4` | `PORTFOLIO` watermark  | Watermark on light                     |
| `--color-line`           | `#E4E4E4` | service row rules      | Hairline dividers, pill borders        |
| `--color-panel`          | `#242424` | experience panel       | Inverted section, expanded service row |
| `--color-panel-ghost`    | `#303030` | `EXPERIENCE` watermark | Watermark on dark                      |
| `--color-panel-line`     | `#3A3A3A` | experience row rules   | Dividers on dark                       |
| `--color-on-panel`       | `#F8F8F8` | company names          | Primary text on dark                   |
| `--color-on-panel-muted` | `#A5A5A5` | roles, dates           | Secondary text on dark                 |
| `--color-pill`           | `#161616` | `Let's Talk` fill      | Solid dark buttons                     |
| `--color-accent`         | `#1ECB5C` | availability dot       | The only chroma on the site            |

Notes:

- The service expanded panel measured `#262626` against the experience panel's
  `#242424`. The 2-unit difference is within WebP quantisation; use one token.
- The hairline rule measured a darkest sample of `~#C8C8C8` on a downscaled
  screenshot, which is a 1 px line plus antialiasing. `#E4E4E4` reproduces the
  observed weight at 1 px. **[inferred from measured]**
- Contrast: `#545454` on `#FCFCFC` is 7.4:1, `#AAAAAA` on `#FCFCFC` is 2.3:1.
  `--color-ink-subtle` therefore **must not** be used for body text — only for
  decorative counters that duplicate information available elsewhere, or it must
  be darkened. See §19.

### Contact section background

The contact section is the one place with a photographic background: a soft,
desaturated, high-key sky/cloud image, sampled at `#E8E8E8`–`#F0F0F0`
**[measured, video t=15.5 and `contact.webp`]**. It is confirmed by
autocontrast analysis of the video — clouds are present inside the rendered
viewport, not only in the presentation backdrop.

The clouds visible around the _services_ section in `service.webp` are **not**
part of the site. The video at the same section shows a flat near-white
background. See §17.

---

## 5. Typography

### Families

Two families, confirmed by glyph comparison **[measured]**:

- **Display** — a neo-grotesque (Helvetica/Neue Haas lineage). Uniform stroke,
  straight-legged `R`, horizontal `C` terminals. Used for the hero wordmark,
  `/SECTION` headings, service row titles, the contact H2, watermarks, and the
  project detail title.
- **UI** — a geometric-humanist sans with a **single-storey `g`** and a
  double-storey `a`. Used for nav links, body copy, buttons, chips, card titles,
  and every experience row.

The exact commercial faces cannot be identified from raster references. Closest
freely-licensed matches: **Inter** (display) and **Figtree** or **Hanken
Grotesk** (UI). **Font delivery is an open decision** — see §20 and
[plan.md](plan.md) Phase 1. Until it is resolved, both roles fall back to a
system grotesque stack.

`minimalist-ui` bans Inter outright. The reference's display face is a
Helvetica-class neo-grotesque, so that ban is overridden here
(CLAUDE.md §12); recorded in §17.

### Scale

Sizes are derived from cap-height measurement at the 1440 px baseline. Cap
heights carry roughly ±4 px of antialiasing error, so font sizes are given as
best estimates, cross-checked against measured string widths.

| Role                             | Cap height (CSS)       | Font size                                           | Weight | Family  |
| -------------------------------- | ---------------------- | --------------------------------------------------- | ------ | ------- |
| Hero wordmark                    | 109–116 **[measured]** | ~150 px                                             | 700    | Display |
| Section watermark                | 96–103 **[measured]**  | ~140 px                                             | 500    | Display |
| Service row title                | 49–56 **[measured]**   | ~68 px                                              | 400    | Display |
| Contact H2                       | 51–58 **[measured]**   | ~68 px                                              | 700    | Display |
| Project detail title             | —                      | ~64 px **[inferred]**                               | 700    | Display |
| Section heading `/NAME`          | 41–48 **[measured]**   | ~56 px                                              | 400    | Display |
| Hero subtitle (`UI/UX Designer`) | ~26 **[measured]**     | ~32 px                                              | 600    | UI      |
| Project card title               | —                      | ~20 px **[inferred]**                               | 500    | UI      |
| Experience company               | —                      | ~18 px **[inferred]**                               | 500    | UI      |
| Body copy                        | —                      | ~16 px **[inferred]**                               | 400    | UI      |
| Nav link                         | —                      | ~16 px **[inferred]**                               | 500    | UI      |
| Chip / pill label                | —                      | ~14 px **[inferred]**                               | 500    | UI      |
| Meta, nav counter, date          | —                      | ~12 px **[inferred]**                               | 400    | UI      |
| Category badge (`REAL PROJECT`)  | —                      | ~10 px, `0.08em` tracking, uppercase **[inferred]** | 500    | UI      |

Implement the four largest roles with `clamp()` so they scale fluidly rather
than stepping at breakpoints. The wordmark is roughly `10.4vw` at 1440.

### Treatment

- Hero wordmark and all `/SECTION` headings are **uppercase** with visibly
  **positive tracking** (approximately `0.02em`–`0.04em` **[inferred]**).
- Section headings are literally prefixed with a forward slash: `/SERVICE`,
  `/SELECTED WORK`, `/EXPERIENCE`, `/MORE WORK`. The slash is a glyph in the
  same run, same size and weight — not an icon, not a pseudo-element with
  different styling.
- Body copy line-height is loose, roughly `1.55` **[inferred]**.
- Display headings are set tight, roughly `0.95`–`1.0` **[inferred]**.
- Apply `text-wrap: balance` to headings and `text-pretty` to paragraphs.

---

## 6. Spacing System

Use Tailwind's built-in scale. Arbitrary values only where a measured value has
no near neighbour on the scale (CLAUDE.md §9).

| Measure                                | Value                             | Source                            |
| -------------------------------------- | --------------------------------- | --------------------------------- |
| Page gutter (hero, nav, services)      | **80 px** at ≥1440                | **[measured]** 76–85 px           |
| Content column (hero, nav, services)   | **1280 px** max                   | **[measured]** 1273–1285 px       |
| Hero lower row / contact footer column | **1216 px** max (112 px gutters)  | **[measured]** 1194–1220 px       |
| Projects grid column                   | **1104 px** max, centred          | **[measured]** 1103 px, symmetric |
| Experience dark panel                  | full width minus **16 px** margin | **[measured]** 15.3 / 14.2 px     |
| Projects grid gap                      | **56 px**                         | **[measured]** 55 px              |
| Service row inner padding (x)          | **24–28 px**                      | **[measured]**                    |
| Service collapsed row pitch            | **~188 px**                       | **[measured]**                    |
| Social rail pill pitch                 | **~79 px**                        | **[measured]**                    |
| Nav from viewport top                  | **~56 px**                        | **[measured]** centre at 79 px    |
| Hero wordmark top                      | **~232 px** from viewport top     | **[measured]**                    |
| Section vertical padding               | **~128 px** (`py-32`)             | **[inferred]**                    |

The 1280 px content column at a 1440 px viewport is exactly Tailwind's
`max-w-7xl` with 80 px gutters. Note the existing `Container` primitive
(`max-w-7xl px-4 sm:px-6 lg:px-8`) yields a 1216 px _content_ width, which
matches the hero's lower row and the contact footer but is 64 px narrower than
the hero wordmark and nav. Both widths are real and both are needed — see §7.

---

## 7. Layout System

Four container widths, all centred:

```
+- viewport 1440 -------------------------------------------+
|  80 | WIDE   1280  (nav, hero wordmark, service rows) | 80 |
| 112 | BASE   1216  (hero lower row, contact footer)   |112 |
| 168 | NARROW 1104  (projects grid)                    |168 |
|  16 | PANEL  1408  (experience dark card)             | 16 |
+-----------------------------------------------------------+
```

- `WIDE`, `NARROW` and `PANEL` are new variants of the existing `Container`
  primitive.
- `BASE` is `Container`'s current behaviour. Do not change it; add variants.
- Use CSS Grid for the projects grid and the experience rows, not flexbox
  percentage maths (CLAUDE.md §7).
- Full-height sections use `min-h-[100dvh]`, never `h-screen`.

### Page structure

Derived from the video's scroll order **[measured]**:

```
Route: /                          Route: /work/:slug
├── Navbar (static, in hero)      ├── Detail top bar (Back / Availability)
├── Hero                          ├── Project header (2 columns)
├── Selected Work                 ├── Media showcase (stacked frames)
├── Service                       ├── Caption block
├── Experience                    ├── /MORE WORK (2 cards)
├── Contact                       ├── Contact
└── Footer                        └── Footer
```

No sections beyond these appear in any reference. Do not invent others.

---

## 8. Navigation

**[measured]** from `home.webp` and video t=0.8–4.2.

Layout, left to right inside the `WIDE` container:

1. **Availability pill** — white, full radius, soft ambient shadow, `#1ECB5C`
   dot 8 px, label "Available for New Project" at ~13 px.
2. **Link group** — `Work [40]`, `Service [4]`, `Experience [9y+]`, `Contact`.
   Each label is ~16 px medium in the UI family; each counter is a separate
   ~12 px `#AAAAAA` span in square brackets, raised slightly and set tighter.
   `Contact` has no counter.
3. **CTA** — `Let's Talk ↗`, solid `#161616` pill, white label, inline arrow
   glyph, soft ambient shadow.

### Behaviour

| Property                    | Finding                                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Sticky / fixed              | **No.** The navbar scrolls out of view and does not return. Nav ink measured 0.52/255 at video t=4.17 and never reappears through t=16. **[measured]** |
| Appearance change on scroll | Not applicable — it does not persist. **[measured]**                                                                                                   |
| Active-section highlight    | **NOT OBSERVED.** The nav is never on screen while a later section is active.                                                                          |
| Link hover state            | **NOT OBSERVED.** The cursor never enters the nav in the recording.                                                                                    |
| Click behaviour             | **NOT OBSERVED.** All navigation in the recording is by scrolling.                                                                                     |
| Mobile menu                 | **NOT OBSERVED.** Desktop only.                                                                                                                        |

**Implementation position:** reproduce the non-sticky navbar exactly as
observed. Because the anchors must still work, implement them as real in-page
`<a href="#work">` links with `scroll-margin-top` on each section
(CLAUDE.md §10, Web Interface Guidelines). Do **not** add a sticky header, a
scroll-spy active state, an animated underline, or a progress bar — none are
supported by the references ([rule.md](rule.md) Rule 4). A mobile menu is a
responsive necessity, not an invention; see §15.

---

## 9. Home Section

**Visual hierarchy:** wordmark → portrait → role/CTA → social rail → nav.

### Layout

Full-viewport (`min-h-[100dvh]`) three-band composition:

```
+----------------------------------------------------------+
| [pill]   Work  Service  Experience  Contact  [Let's Talk] |  ~56px top
|                                                           |
|   D Y M A S   A L F I N        (1280 wide, ~150px)        |  top ~232px
|                    +--------+                             |
|                    |portrait|                             |
|  UI/UX Designer    | cutout |               [ Dribbble ]  |
|  Designing digital |        |               [ Instagram]  |
|  products that...  |        |               [ LinkedIn ]  |
|  [Let's collaborate]        |               [ Behance  ]  |
+----------------------------------------------------------+
```

### Components

- **Wordmark** — two spans in one `<h1>`. First word: transparent fill with a
  ~2 px stroke in `--color-ink` (`-webkit-text-stroke`). Second word: solid
  `--color-ink`. **[measured]**
- **Portrait** — a background-removed cutout, greyscale/desaturated with faint
  colour retained in the face, centred horizontally, bottom-anchored, sitting
  in front of the wordmark's baseline. The head crown clears the wordmark by
  only a few pixels. **[measured]**
- **Role block** — bottom-left: `UI/UX Designer` (~32 px, 600), two-line
  description (~16 px, `--color-ink-muted`), then a solid `#161616` pill
  `Let's collaborate ↗`.
- **Social rail** — bottom-right, four **equal-width** (~150 px) white pills
  stacked at ~79 px pitch, each with a 16 px outline icon and a ~13 px label.
  **[measured]** — all four pills share one width, content left-aligned inside.

### Interaction clues

- **Portrait colour wipe — the hero's one hover state.** The cutout renders
  desaturated. When the cursor enters it, a full-colour copy is uncovered by a
  hard vertical edge that trails the pointer's x: everything right of the edge
  is in colour, everything left of it stays desaturated. **[measured]**
  - The edge is vertical and full-height. Per-row leftmost coloured pixel at
    t=3.30 is 720 / 720 / 742 across the face band — one straight boundary.
  - It does not snap to the cursor. With the pointer parked at x≈650 the edge
    walked 920 → 652 px between t=3.117 and t=3.633, each 16 ms frame closing
    ≈15 % of the remaining gap. That is an exponential settle (τ ≈ 100 ms,
    ~520 ms to rest), not a linear sweep — the same damped follow the project
    card and experience thumbnail use.
  - On entry the edge starts closed at the cutout's right rim and eases left to
    the pointer; the first coloured pixels appear at x=920, near that rim.
  - On exit it is a **single-frame cut**, not a retraction: t=3.950 is fully
    coloured, t=3.967 is fully desaturated, with no intermediate edge position.
    **[measured]**
  - **Shipped behaviour is generalised past the reference, by instruction.**
    The recording only ever enters the cutout from the right, so it only ever
    shows a vertical edge sweeping left. The implementation measures which edge
    the pointer actually crossed and applies the same rule from all four:
    colour fills the span between the entry edge and the pointer, on a vertical
    boundary for left/right entry and a horizontal one for top/bottom. Verified
    in Chromium at 1440x900 - pointer at x=783 colours x 782..1058 (from the
    right), at x=721 colours x 445..721 (from the left), at y=537 colours
    y 347..537 (from the top), at y=861 colours y 861..899 (from the bottom).
  - The lower content band and the wordmark sit at z-20 over the portrait's
    z-10, so the cutout is only reachable across the face and a strip at its
    foot. That is existing stacking and is left alone; the reference hovers the
    face too.
  - The reference swaps in a *different photograph* for the colour layer — the
    subject wears glasses in it and not in the desaturated one. Only one
    portrait exists in the source assets, so the implementation reveals the same
    file in
    colour. The wipe mechanic is reproduced; the wardrobe change is not, for
    want of a second frame.
- No other hover state is observable on any hero element. **NOT OBSERVED.**
- The availability dot is static in the reference; no pulse is visible.
  **NOT OBSERVED** — do not add one.

### Copy in the reference

`Available for New Project` · `DYMAS ALFIN` · `UI/UX Designer` · `Designing
digital products that are clear, usable, and conversion focused.` ·
`Let's collaborate` · `Let's Talk`.

The social rail label reads **`Intagram`** in both `home.webp` and
`contact.webp` — a typo in the reference. Ship `Instagram`
([rule.md](rule.md) Rule 17).

---

## 10. Services Section

**[measured]** from `service.webp` and video t=7.9–10.5.

An accordion list, not a card grid.

### Structure

```
/SERVICE                                      <- ~56px, over a "SERVICE" watermark
+------------------------------------------------+
|  UIUX DESIGN                     [media]    x  |  <- expanded, #242424, radius ~16px
|  Designing clear and scalable interfaces for   |
|  dashboards, mobile apps, and websites.        |
+------------------------------------------------+
   WEB DESIGN & DEV                            ->
  ------------------------------------------------
   BRANDING                                    ->
  ------------------------------------------------
   MOTIONS & ANIMATIONS                        ->
  ------------------------------------------------
```

### Collapsed row

- Title: ~68 px display, uppercase, `--color-ink`.
- Right affordance: a thin-stroke `↗` glyph.
- 1 px `--color-line` rule beneath.
- Row pitch ~188 px; content sits in the upper portion of the row.
- No background, no border, no radius.

### Expanded row

- Becomes a `--color-panel` block with ~16 px radius, spanning the full `WIDE`
  container.
- Title turns white; a two-line description in `--color-on-panel-muted`
  appears beneath it.
- The `↗` is replaced by a thin white `×`.
- A **media card overhangs the panel's top edge** by roughly 40 px: a white
  card containing the service's work sample, rotated about `-4°`, with a soft
  drop shadow, positioned right of centre. **[measured]**

### Trigger

The video shows the cursor resting on the row immediately before it expands
**[measured]**, and the expanded state carries a `×` close affordance
**[measured]**. Whether the trigger is hover or click is **not resolvable**
from the recording.

**Implementation position:** implement as **click / Enter / Space toggle** on a
real `<button>`. This is the accessible reading, works on touch, and is
consistent with the `×` affordance. Documented as a deliberate resolution of
ambiguity, not an invention ([rule.md](rule.md) Rule 4).

### Height animation

Expansion changes the row's height, which CLAUDE.md §8 rule 6 forbids animating.
The sanctioned technique for this project:

- The panel's size change is a **CSS transition on `grid-template-rows`
  (`0fr` → `1fr`)** on the collapsible wrapper — a CSS transition, not a JS
  animation, and it never writes `top`/`left`/`width`/`height`.
- Everything else — background colour crossfade, title colour crossfade,
  description and media fade, `↗`→`×` swap — goes through Anime.js on
  `opacity` and `transform` only.

This is the single documented exception and is recorded in
[rule.md](rule.md) Rule 6.

---

## 11. Projects Section (`/SELECTED WORK`)

**[measured]** from `project.webp` and video t=5.6–7.5.

### Structure

- Ghost watermark `PORTFOLIO` (~140 px, `--color-ink-ghost`, wide tracking),
  centred, with the real heading overlapping its lower third.
- Heading `/SELECTED WORK` (~56 px), centred.
- Control row: filter group left (`All`, `Real Project`, `Exploration`), pill
  `View All Work ↗` right. `All` reads as the active filter (heavier / darker);
  the active treatment is a weight-and-colour change with **no underline and no
  pill** in the reference. **[measured]**
- **Grid: 2 columns**, 56 px gap, 1104 px column. It is a grid — not a
  carousel, not horizontal scroll, not a stack. Four cards are visible in the
  video (`BloomCare`, `FragWater`, `CryptoCalm`, `Spenso`). **[measured]**

### Project card

```
+-----------------------------+  <- --color-surface, radius ~12px
| +-------------------------+ |
| |[REAL PROJECT]      (->) | |  <- media frame ~1.4:1, radius ~8px
| |      project shot       | |
| +-------------------------+ |
| FragWater - Luxury          |  <- ~20px / 500, up to 2 lines
| Fragrance Landing Page      |
| [Landing Page][Kumpin Studio]|  <- chips, radius-full, 1px --color-line
+-----------------------------+
```

- Media frame is a **fixed aspect ratio** (~1.4:1) with `object-fit: cover` —
  a repeatable module (`image-to-code` §20).
- The `REAL PROJECT` badge is **persistent, not hover-revealed**: it is present
  at video t=6.27, before the hover affordance appears, and on the
  non-hovered card at t=6.35. **[measured]** It reflects the project's
  category.
- Card surface is `--color-surface` at rest.

### Hover

- A **white circular button (~54 px) containing `↗` fades in over the media and
  then follows the pointer with easing.** Measured at video t=6.40 and t=6.47:
  the button's centre tracks the cursor at a roughly constant offset as the
  cursor crosses the card. **[measured]**
- The media itself does not scale, the card surface does not change colour, and
  the card does not lift. **NOT OBSERVED.**

### Click

Navigates to the project detail view. **[measured]** — video t=16.4 → 17.9.

---

## 12. Experience Section

**[measured]** from `experience.png` and video t=10.5–15.0.

The one inverted section: a `--color-panel` card, full width minus a 16 px
margin, radius ~10 px, occupying roughly a full viewport height.

### Structure

```
+- #242424 -------------------------------------------------+
|   E X P E R I E N C E            <- watermark, #303030     |
|  /EXPERIENCE            9+ years of experience             |
|                                                            |
|  Kumpin Studio                            Nov 2025 - Now   |
|  UI/UX & Product Designer                                  |
|  --------------------------------------------------------  |
|  Mikan Team                               Aug 2025 - Now   |
|  Creative Director                                         |
|  --------------------------------------------------------  |
|  ... Microsoft / Facebook / Apple                          |
+------------------------------------------------------------+
```

- Heading `/EXPERIENCE` in white, with `9+ years of experience` right-aligned
  on the same optical line.
- Rows: company (`--color-on-panel`, ~18 px, 500) over role
  (`--color-on-panel-muted`, ~16 px); date range right-aligned in
  `--color-on-panel-muted`. 1 px `--color-panel-line` rule between rows.
- Inner padding ~110 px left, ~86 px right **[measured]**.

**This is a two-column list, not a timeline.** There is no rail, no connector,
no dot, no node marker in any reference. Do not add one
([rule.md](rule.md) Rule 4).

### Hover

**The signature interaction of the site.** Hovering a row reveals a small
work-sample thumbnail that **follows the cursor**, rotated roughly `-10°`,
offset to the right of the pointer, trailing it with easing. Measured across
video t=13.45–14.9: as the cursor travels right-to-left along the Kumpin Studio
row, the thumbnail tracks it with a visible lag. **[measured]**

Row text brightening on hover: **NOT OBSERVED** — the recording is not
conclusive. Do not add it.

---

## 13. Contact Section

**[measured]** from `contact.webp` and video t=15.0–16.4.

**There is no contact form.** The section is a centred call-to-action block.
Do not build a form, inputs, or validation ([rule.md](rule.md) Rule 4).

```
                    [* Available for New Project]
              HAVE A PROJECT IN MIND?              <- ~68px, 700, display
    Together, we can create something clear and impactful.
    Let's collaborate to bring our ideas to life in a way
              that resonates with everyone.
                      [Contact Me ->]
```

- Background: the soft cloud image (§4), with the panel's top corners rounded.
- The availability pill is the same component as the navbar's.
- Paragraph column is ~950 px wide, centred, `--color-ink-muted`.
- CTA is the solid `#161616` pill.

---

## 14. Footer

A single row in the `BASE` container (~1220 px), justified across the full
width **[measured]**:

- Left: a solid `#161616` pill containing a circular avatar photo inset at the
  left edge and the owner's name in white.
- Right of it, evenly distributed: four white social pills — Dribbble,
  Instagram, LinkedIn, Behance — each icon + label.

No copyright line, no secondary nav, no newsletter. The footer is reused
unchanged on the project detail route.

---

## 15. Project Detail View

**[measured]** from video t=17.2–21.0. This view exists and is a full second
page; it is not a modal.

```
[<- Back]                             [* Available for New Project]

[Landing Page] [Kumpin Studio]                        Service
FragWater  /Real Project                UI/UX Design, Web Design
a modern luxury fragrance brand                      Timeline
brought to life through a clean,                     4 Weeks
elegant, and high-end landing page                      Tools
experience.                                        [tile] [tile]
[Live Preview ->]  [Contact Me]

+--------------------------------------------------+
|  +--------------------------------------------+  |  <- framed media,
|  |            full-page project shot          |  |     stacked vertically
|  +--------------------------------------------+  |
+--------------------------------------------------+
              ... repeated per image ...

  +- caption box -------------------------------+
  | This design focuses on premium visual ...    |
  +----------------------------------------------+

                    /MORE WORK
        [card]                    [card]

              (Contact section, reused)
              (Footer, reused)
```

- Top bar: `← Back` white pill left, availability pill right, ~60 px from the
  top. Not sticky. **[measured]**
- Header is two columns: content left, right-aligned meta stack right
  (`Service`, `Timeline`, `Tools` — each a `--color-ink-subtle` label over a
  ~24 px value). `Tools` renders as small rounded white tiles holding tool
  icons.
- Title is the project name in display 700 followed by `/Real Project` in
  display regular, `--color-ink-muted`. **[measured]**
- Buttons: `Live Preview ↗` solid pill, `Contact Me` white bordered pill —
  note `Contact Me` here carries **no** arrow. **[measured]**
- Media showcase: each screenshot sits in its own bordered, padded, rounded
  white frame — a repeatable module.
- Background carries a very subtle diagonal light gradient. **[measured]**
- `/MORE WORK` reuses the project card component in a 2-column grid.

**This view requires routing.** See §20.

---

## 16. Responsive Design

The references show **desktop only, at a single 1440 × 982 viewport**. Every
statement in this section is **[inferred]** and must be treated as a design
decision, not a reproduction. Mark it as such in code review.

| Section    | ≥1280 (observed)               | 768–1279                                           | <768                                                                                                    |
| ---------- | ------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Navbar     | Single row, links centred      | Availability pill hidden, links condensed          | Availability pill + links collapse into a disclosure button; CTA persists                               |
| Hero       | 3-band, portrait centred       | Wordmark to ~12vw, rail moves under the role block | Wordmark stacks to two lines, portrait becomes a bounded block, rail becomes a horizontal wrap of pills |
| Services   | Full-width rows, ~68 px titles | ~48 px titles, media card shrinks                  | ~32 px titles; expanded media stacks **below** the description rather than overhanging                  |
| Projects   | 2-col grid, 1104 px            | 2-col, full-width gutters                          | 1 col; filters scroll horizontally with `overflow-x-auto`                                               |
| Experience | Panel, 2-col rows              | Panel margin to 16 px, padding to 40 px            | Date moves **below** the role, left-aligned; hover preview disabled                                     |
| Contact    | Centred, 950 px copy           | Same, narrower                                     | Footer pills wrap to a 2-column grid                                                                    |
| Detail     | 2-col header                   | 2-col, tighter                                     | Meta stack moves below the header content, left-aligned                                                 |

Cross-cutting inferred rules:

- Pointer-following interactions (project hover button, experience preview) are
  **pointer-only**. Gate them behind `(hover: hover) and (pointer: fine)` and
  provide a tap/click equivalent — the card is a link; the experience row shows
  its thumbnail inline on small screens or not at all.
- The mobile navigation disclosure is a **responsive necessity**, explicitly
  logged here as inferred rather than reproduced.
- No horizontal page scroll at any width. Wide content scrolls inside its own
  container.

---

## 17. Reference vs Inference

### Reference discrepancies

Resolution priority: **video → section screenshots → inferred responsive
behaviour**.

| #   | Conflict                                                                                                                                                                            | Resolution                                                                                                                                                            |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `service.webp` shows a photographic cloud background behind the accordion rows; the video shows a flat near-white background at the same section (t=9.0, confirmed by autocontrast) | **Video wins.** The cloud in `service.webp` is the presentation backdrop, not the site. Services background is `--color-canvas`.                                      |
| 2   | `service.webp` shows no `SERVICE` watermark; the video shows one clearly at t=8.5–9.5                                                                                               | **Video wins.** The watermark exists; it was washed out by the bright cloud composite.                                                                                |
| 3   | `contact.webp` shows clouds — same composite question as #1                                                                                                                         | **Both agree.** Autocontrast of video t=15.5 confirms clouds _inside_ the viewport. The contact background is genuinely photographic.                                 |
| 4   | `project.webp` suggests the hovered card has a different background from the idle card                                                                                              | **Histogram disproves it.** Both card bodies are `#F4F4F4`. There is no hover background change.                                                                      |
| 5   | `project.webp` shows a `REAL PROJECT` badge only on the hovered card                                                                                                                | **Video wins.** The badge is present pre-hover (t=6.27) and on the non-hovered card at t=6.35. It is a persistent category badge.                                     |
| 6   | Static frames suggest the social pills fade in one by one                                                                                                                           | **Centroid tracking disproves it.** They translate as one locked group; the apparent stagger was an artefact of measuring fixed windows that moving elements crossed. |
| 7   | Screenshots imply a single container width                                                                                                                                          | **Measurement disproves it.** Three content widths (1280 / 1216 / 1104) plus the experience panel are measurable and consistent across both sources.                  |

### Explicitly NOT OBSERVED

Do not implement any of these without new evidence or an explicit instruction:

- Navbar link hover, active-section highlighting, underline animation, sticky
  or shrinking header, scroll progress indicator.
- Navbar click-to-scroll behaviour (anchors are an accessibility requirement,
  not an observed behaviour).
- Availability-dot pulse or any looping ambient animation.
- Project card lift, shadow change, surface colour change, or image zoom on
  hover.
- Experience row text brightening on hover.
- Filter transition animation when switching `All` / `Real Project` /
  `Exploration`.
- Any scroll-linked parallax on any section.
- Custom cursor. The recording shows the OS arrow throughout.
- Every mobile and tablet behaviour. §16 is entirely inferred.

### Skill conflicts resolved against the reference

Per CLAUDE.md §12, the user's explicit request (reproduce the reference) and
CLAUDE.md outrank skill opinions.

| Skill                                     | Its rule                                                   | Resolution                                                                                                                                          |
| ----------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `minimalist-ui`                           | Never use `rounded-full` for buttons or large containers   | **Overridden.** Pill geometry is the reference's defining component language.                                                                       |
| `minimalist-ui`                           | Never use Inter                                            | **Overridden.** The display face is a Helvetica-class neo-grotesque; Inter is the closest free match.                                               |
| `minimalist-ui`                           | Use Phosphor or Radix icon packages                        | **Not adopted.** Inline SVG only — no new dependencies (CLAUDE.md §18).                                                                             |
| `minimalist-ui`                           | Use muted pastel accents; add ambient background gradients | **Not adopted.** The reference is monochrome with one green dot and flat section backgrounds.                                                       |
| `minimalist-ui`                           | Constrain content to `max-w-4xl`/`max-w-5xl`               | **Overridden** by measured container widths (§6).                                                                                                   |
| `frontend-design`                         | Take a real aesthetic risk; invent a signature element     | **Not applicable.** This is a reproduction; the signature elements already exist (outlined wordmark, ghost watermarks, pointer-following previews). |
| `image-to-code`                           | Generate reference images before coding                    | **Skipped** as CLAUDE.md §11 directs — references were supplied. Its extraction rules (§21–28) and fixed-media-frame rule (§20) were applied.       |
| `minimalist-ui`, Web Interface Guidelines | Scroll reveal via `IntersectionObserver`                   | **Compatible.** Implemented via Anime.js `onScroll()`, the project-sanctioned equivalent (CLAUDE.md §8 rule 7).                                     |

---

## 18. Animation System

Derived by frame-differential analysis of the video. Opacity curves come from
regional ink measurement; motion comes from opacity-invariant centroid
tracking, so translation figures are not artefacts of the fade.

### Motion language

Slow, calm and expensive. Long durations (700–900 ms), heavy deceleration,
generous travel distances, modest stagger. Nothing bounces; nothing is fast.
Elements enter from the nearest viewport edge — top-anchored content descends,
bottom-anchored content rises.

### Measured hero entrance

Timings relative to entrance start T0 ≈ video t=0.85 s. Distances are CSS px at
the 1440 baseline.

| Element                      | Delay    | Transform                                | Opacity            | Duration | Curve                         |
| ---------------------------- | -------- | ---------------------------------------- | ------------------ | -------- | ----------------------------- |
| Navbar                       | 0        | `translateY(-31 → 0)`                    | 0 → 1              | ~750 ms  | Strong ease-out               |
| Wordmark                     | ~200 ms  | `translateY(-66 → 0)`                    | 0 → 1              | ~700 ms  | Ease-out, slight ease-in lead |
| Role block (h2 + copy + CTA) | ~580 ms  | `translateY(+70 → 0)`                    | 0 → 1              | ~460 ms  | Ease-out                      |
| Social rail (as one group)   | ~580 ms  | `translateY(+170 → 0)`                   | opaque, clipped    | ~720 ms  | Ease-out                      |
| Portrait                     | ~1150 ms | `translateY(+384 → 0)` + slight scale-up | 0 → 1, near-linear | ~850 ms  | Ease-out                      |

Supporting measurements:

- Navbar centroid: 125.2 px → 153.9 px between t=0.88 and t=1.60.
- Wordmark centroid: 310.5 px → 370.9 px between t=0.96 and t=1.68.
- Role block centroid: 854.6 px → 790.9 px between t=1.44 and t=2.16.
- Social rail: the four pills move in **lockstep** at a fixed 72 px (video)
  pitch — it is one group translating, not four staggered items. Successive
  50 ms deltas of −23, −16, −11, −9, −6, −5, −3, −3, −1, −1 px give a
  near-constant 0.70 decay ratio, i.e. an **exponential ease-out**.
- Portrait head-crown y: 796 → 445 px between t=2.07 and t=2.53; peak ink rises
  linearly 18 → 247 over t=2.07–2.93.

### Measured scroll reveal

| Property             | Value                                                    |
| -------------------- | -------------------------------------------------------- |
| Trigger              | Section entering viewport                                |
| Heading ramp         | ~740 ms (services heading, t=8.23 → 8.97)                |
| Child duration       | ~800–900 ms                                              |
| **Stagger**          | **~130 ms** (service rows begin at t=8.57 / 8.70 / 8.83) |
| Project card stagger | ~150–200 ms                                              |
| Direction            | Rise + fade                                              |

### Measured interaction motion

| Interaction            | Value                                                                |
| ---------------------- | -------------------------------------------------------------------- |
| Service accordion open | ~430 ms core, ~700 ms fully settled (t=9.77 → 10.20/10.40)           |
| Card hover button      | Fade/scale in, then pointer-follow with easing                       |
| Experience preview     | Fade/scale in, then pointer-follow with easing                       |
| Route change to detail | Scroll to top, then the detail page runs the same staggered entrance |

### Tokens

Define in `@theme`; consume from the Anime.js preset layer.

```
--motion-fast:    200 ms   hover / state change
--motion-base:    460 ms   small element entrance
--motion-slow:    750 ms   nav, headings, section reveal
--motion-xslow:   900 ms   portrait, social rail
--motion-stagger: 130 ms
--motion-ease-out:   cubic-bezier(0.16, 1, 0.3, 1)     ~ outExpo
--motion-ease-inout: cubic-bezier(0.65, 0, 0.35, 1)
```

### Implementation architecture

Strictly through the existing pipeline (CLAUDE.md §3, §8):

```
component -> useAnimation / useAnimationOnHover / useScrollReveal
          -> preset factory in src/animations/presets/
          -> createAnimation / shouldReduceMotion
          -> Anime.js v4 (animate, createScope, stagger, onScroll, createAnimatable)
```

New presets required: `revealUp`, `revealDown`, `staggerReveal`, `pointerFollow`.

New hook required: `useScrollReveal` — a scroll-triggered variant of
`useAnimation` built on Anime.js `onScroll({ target, enter })` passed as
`autoplay`, because the existing `useAnimation` fires unconditionally on mount.

`createAnimatable` is the correct primitive for both pointer-following
elements: create it once inside the scope, then drive its `x`/`y` setters from
`pointermove`. Its `duration` + `ease` settings produce the observed damped
trail without a manual `requestAnimationFrame` loop.

### Reduced motion

Every entry point checks `shouldReduceMotion()`. Every element is authored in
its **final** visual state, so a skipped animation still renders a correct,
complete page. Under reduced motion:

- All entrance and scroll-reveal animations are skipped entirely.
- Both pointer-following behaviours are disabled; the card's `↗` button becomes
  statically positioned and the experience thumbnail does not appear.
- The accordion's `grid-template-rows` transition is neutralised by the existing
  global CSS reset in `src/styles/index.css`.

Every Anime.js scope reverts on unmount; every `pointermove` listener and
`onScroll` observer is torn down.

---

## 19. Accessibility

Beyond CLAUDE.md §10, this design creates specific obligations:

- **Outlined wordmark.** `-webkit-text-stroke` on transparent fill is a
  presentational effect on real text. Keep the text in the DOM as an `<h1>`;
  verify the stroke renders in every target browser and provide a solid-fill
  fallback via `@supports not (-webkit-text-stroke: 1px black)`.
- **Ghost watermarks** are decorative duplicates of the adjacent heading. Mark
  them `aria-hidden="true"` so screen readers do not hear each section name
  twice.
- **Nav counters** (`[40]`, `[9y+]`) are `#AAAAAA` on near-white — 2.3:1, below
  the 4.5:1 minimum. Either darken them to at least `#767676` or mark them
  `aria-hidden` and ensure the count is available elsewhere. **This is a real
  accessibility defect in the reference and must not be reproduced verbatim.**
- **Service accordion** is a `<button>` per row with `aria-expanded` and
  `aria-controls`; the panel is labelled by its trigger. `↗`/`×` are decorative
  and `aria-hidden`.
- **Pointer-following elements** are decorative and pointer-only. The
  underlying action must be reachable by keyboard: the project card is wrapped
  in a real `<a>`, focusable, with a visible focus ring.
- **Filters** are real `<button>`s with `aria-pressed`, or links that write the
  filter to the URL query. Prefer the URL — it makes the filtered state
  shareable and the back button correct.
- **Heading outline:** one `<h1>` (the wordmark) on the home route; each
  section heading is an `<h2>`; card titles are `<h3>`. On the detail route the
  project name is the `<h1>`.
- **Focus:** keep the existing project pattern —
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`.
  Never remove a focus indicator.
- Every section that a nav anchor targets needs `scroll-margin-top`.
- Dark-panel text: `#A5A5A5` on `#242424` is 6.0:1 — passes.

---

## 20. Asset Strategy

Prefer existing project assets; do not generate images unnecessarily
(CLAUDE.md §11 Tier 3).

| Asset                       | Status                     | Strategy                                                                                                                                            |
| --------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portrait cutout             | **Supplied** (Phase 3)     | `information/source-assets/portfolio-image.png`, a background-removed full-body PNG. Cropped to head, shoulders and upper chest and re-encoded as WebP. |
| Project screenshots         | **Supplied for 5 of 10**   | Five tall device captures in `information/source-assets/`. The other five projects have no capture on record and keep the neutral frame.             |
| Service media samples       | **Substituted** (Phase 3)  | No service imagery exists. Each panel shows a shipped project that exercises that service; the card is decorative and `aria-hidden`.                 |
| Experience hover thumbnails | **Supplied for 2 of 5**    | The two entries with a shipped interface use its capture; the other three keep the neutral frame carrying the organisation's name.                   |
| Contact cloud background    | **Still missing**          | No sky or cloud asset was supplied. The `.sky-wash` CSS approximation in `src/styles/index.css` remains in place.                                    |
| Avatar (footer pill)        | **Derived** (Phase 3)      | Square face crop of the portrait, flattened onto the pill's own fill so no transparent halo shows.                                                   |
| Social / tool icons         | Buildable                  | **Inline SVG components.** No icon package (CLAUDE.md §18).                                                                                          |
| `↗`, `←`, `×` glyphs        | Buildable                  | Inline SVG, shared stroke width, `aria-hidden`.                                                                                                     |

### 20.1 The derivation pipeline (Phase 3)

The owner's originals arrived as seven PNGs totalling roughly 10 MB, the hero
cutout alone being 1.9 MB. Serving them directly would have put that on the LCP
path, so `scripts/build-assets.py` derives one WebP per original into
`src/assets/images/`:

```
information/source-assets/*.png  (source of truth, never modified, never served)
      |
      v  scripts/build-assets.py  (Pillow)
      |
src/assets/images/*.webp  (~390 KB total)
      |
      v  imported by src/features/portfolio/data/assets.js, projects.js,
         services.js, experience.js
      |
      v  Vite fingerprints and emits them
```

Two derivatives are made per screenshot:

| Derivative | Size | Used by |
|---|---|---|
| `<name>.webp` | source pixels | the detail route, shown whole at `contain` |
| `<name>-card.webp` | 1280 x 720 | card, service and experience frames, at `cover` |

Screenshots keep their source pixel dimensions in the first derivative - the
largest on-page use is the detail frame at roughly 460 x 830 CSS px, so the
source doubles as the 2x asset. The portrait is cropped before encoding.

Importing through the data layer rather than referencing `/public` URLs means a
missing asset fails the build instead of 404ing at runtime, and every file is
content-hashed.

The originals started out in `public/` and were moved to
`information/source-assets/` in Phase 4. Vite copies `public/` verbatim into
`dist/`, so all 10 MB shipped on every deploy despite no page ever requesting
them; the move cut `dist/` from 10.4 MB to 0.87 MB and left every derivative
byte-identical (verified by checksum). `public/` now holds `favicon.svg` and
`robots.txt` only.

### 20.2 Fit and composition

Every capture supplied is a tall device frame, roughly 0.5:1, going into
landscape frames. Cropping one to fit sliced the device in half and cut its
headline mid-word - the first attempt did exactly that and it read as a
mistake, not as a crop.

The fix is composition rather than crop tuning. `scripts/build-assets.py` reads
each capture's ground colour from its border ring, trims the ground away to get
the device's true bounding box, and re-composes the device whole and centred on
that same ground at 1280 x 720. The frame then has nothing to cut but ground.

- **Service and experience frames** are 16:9, so the composition lands exactly.
- **Project cards** are 1.4:1, so they trim the composition to its central 79%
  of width. The device sits well inside that, so nothing of the screen is lost.
- **Project detail frames** use `contain` on the capture itself. This is the one
  place where the complete screen at full size is the point.

Each project's card therefore carries its own ground colour, which is real - it
is the colour the owner shot the mockup on - and gives the grid its rhythm
without introducing a palette that is not in the work.

`MediaFrame` still exposes `position` for a future asset whose subject is not
centred, but nothing uses it.

### 20.3 Cards with no capture

Five of the ten projects have no interface capture. A stock photograph was
considered and rejected: a card in Selected Work reads as a picture of the thing
that was built, so an unrelated image there is a claim about the work.

`ProjectCover` renders instead - a typographic cover built from the project's
own name and its first three tools, set on `--color-panel`. It reuses the
site's existing pairing of a large low-contrast ghost word with the solid word
against it, the same move `SectionHeading` makes, so a card without a capture
reads as part of the design rather than as a gap. It is inverted because the
light surface cards already carry the captures.

It is `aria-hidden`: the card's own `h3` carries the title.

Rules for all media: fixed-aspect frames, explicit `width`/`height` to prevent
CLS, `loading="lazy"` below the fold, descriptive `alt` on meaningful images and
`alt=""` on decorative ones. **Do not use `inspiration/` files as site assets** —
they are read-only reference material ([rule.md](rule.md) Rule 1).

Where a slot still has no asset on record, the neutral local frame stays. It
carries the subject's own name rather than a "pending" label, so it reads as a
deliberate tile rather than as unfinished work. Do not ship fabricated imagery,
and do not use remote placeholder services.

---

## 21. Open Decisions

These change the shape of the implementation and require the owner's decision
before the phases that depend on them. Tracked in [plan.md](plan.md) Phase 1.

1. **Routing.** The project detail view is a genuine second page. CLAUDE.md §19
   says not to install a router until there is more than one page — that
   condition is now met, but §18 still requires approval before adding a
   dependency. Recommendation: add `react-router-dom` and populate the existing
   `src/app/routes/` placeholder. Alternative if approval is withheld: a
   view-state switch plus the History API, which costs shareable URLs and
   correct back-button semantics.
2. **Fonts.** _Resolved by the owner in Phase 1.1, overriding the
   recommendation below._ The delivery mechanism is as recommended — Google
   Fonts via a preconnected `<link>` with `font-display: swap`, no npm
   dependency — but the families are **Smooch Sans** (body and UI) and
   **Oswald** (display), not `Inter` and `Figtree`. A third display family was
   trialled for the ghost watermarks and dropped: it diverged measurably from
   the reference's letterforms, so the site ships the two typographic voices the
   reference actually has (rule.md Rule 2).
3. **Assets.** _Resolved in Phase 3, closed out in Phase 4._ The owner supplied
   the source media and `information/`. Six of the eight classes in §20 are
   filled from real media; the contact background is the only one still
   missing. Both open mappings were settled in Phase 4: `yarnvia.png` is an
   apparel storefront on the evidence of the capture itself and is wired to the
   resume's one e-commerce project under the name its own wordmark carries, with
   the capture-to-resume linkage recorded as an inference in `projects.js`;
   `ats.png` stays unused, because `information/project.js` files the matching
   repository as under development with a second contributor and no shipped
   status can be established (see [plan.md](plan.md) Phase 14).

   Worth recording for whoever picks this up: the reason `ats.png` has nowhere
   to go is partly a **gap in this specification**, not only a gap in the
   record. Selected Work has exactly two badge states, `Real Project` and
   `Exploration` (§11), and both read as finished. There is no in-progress
   state, because the reference never shows one. Giving ATS a home therefore
   means designing a third state first — its badge, its treatment, and whether
   a card without a live destination and without a description still earns a
   place in the grid. That is a change to this document, and only then a change
   to `projects.js`. It was not made unilaterally.
4. **Content.** _Resolved._ Every reference string was replaced with the
   owner's own record in Phase 2 and extended in Phase 3 from
   `information/project.js` and `information/resetup_resume.pdf`. Two gaps are
   deliberate and documented in the data files: experience periods carry
   verifiable status strings rather than invented date ranges, and the social
   rail ships three real destinations rather than four.

---

## 22. September 2026 presentation redesign

This section supersedes the old reference's visual rules for the current UI.
The user explicitly requested a redesign using
`updatedInspiration/portfolio-reference.png`, with the existing portfolio's
information treated as immutable. Prior reproduction measurements above remain
historical context, not requirements for the new presentation.

### Audit before implementation

- Inspected the React 19 / Vite / Tailwind v4 / Anime.js implementation,
  shared primitives, hooks, routes, feature components, data and asset pipeline.
- The actual implementation has React Router and ten project-detail URLs,
  despite the older scaffold description. Preserve this working architecture.
- Inventoried 10 projects, 4 services, 5 experience entries, 4 social/contact
  destinations, 4 navigation destinations and their derived counters.
- Read both the live data layer and supplied `information/` records. The live
  data layer remains authoritative for presentation; original records remain
  untouched, including entries not currently published.
- Found a real portrait, avatar, five screenshot pairs, source PNGs, inline SVG
  icons and a source resume PDF. No existing About section, download control,
  contact form or theme toggle exists in the live site.
- Captured the original rendered page, URLs and image references before edits.
- Main issues: condensed body typography, large section gaps, decorative ghost
  headings, oversized inverted experience panel and empty screenshot substitutes.

### Design system and reference interpretation

- Canvas `#FAFAF9`, surface `#F0F0ED`, raised surface `#FFFFFF`, ink `#202226`,
  muted text `#56595E`, restrained green `#31815B`. All are Tailwind theme tokens.
- Keep the existing Oswald display font for the name and contact statement.
  Native Segoe UI / Helvetica Neue / Arial improves body and metadata legibility
  without adding a font dependency or stylesheet.
- Align the page to the existing base Container: max-width 1280px with responsive
  16/24/32px inner gutters. Section spacing is 64–80px rather than viewport-sized.
- Use the new reference's compact navigation, split portrait hero, image-led
  work, light timeline and paired contact composition. Prioritize the written
  brief's restrained buttons and editorial project hierarchy where it differs
  from the image's gradients, statistics and repetitive cards.
- Do not copy reference-only projects, numbers, dates, biography, claims, social
  accounts or resume controls. Existing text is rendered directly from the same
  records. No data or media file is edited.
- Two screenshot-rich projects form alternating editorial features. Remaining
  screenshot projects form a compact grid, while projects without screenshots
  become text rows with their real summaries, categories, tags and technologies.
- Preserve URL-based filters, shareable detail routes, external destinations,
  the single-open service accordion and mail/phone actions.
- Use a persistent header with section state from IntersectionObserver. Mobile
  navigation is a non-modal disclosure: hidden links leave the tab order and
  Escape returns focus to the toggle.
- Use the existing animation hooks/presets with small 12px, 400ms reveals and
  250ms image scaling. Preserve the portrait colour-wipe interaction. Author
  everything visible and retain reduced-motion and scope-cleanup behavior.
- Reuse existing contact wording and assets; no new biography or marketing copy.
- Project detail pages inherit the same type, spacing, action and footer system.

Validation results are recorded in `plan.md` after execution. Session screenshots
and automated browser checks are kept in the ignored `.portfolio-qa.local/`
directory, not added as application dependencies or shipped assets.
