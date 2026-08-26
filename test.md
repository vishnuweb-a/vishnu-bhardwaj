# Testing Specification

Quality-assurance specification for the portfolio reconstruction.

**Scope:** how the build is verified. The visual specification is in
[design.md](design.md), sequencing in [plan.md](plan.md), rules in
[rule.md](rule.md).

There is no test runner in this project and none is being added. These are
**manual and command-line checks** executed against `npm run dev` and
`npm run build`. Never record a check as passed unless it was actually run
(CLAUDE.md §15).

**Result legend:** `[ ]` not run · `[x]` passed · `[F]` failed · `[N/A]` not
applicable, with a reason.

---

## 1. Build Tests

Run from the project root. These gate every phase.

- [ ] `npm run lint` exits 0 with no warnings
- [ ] `npm run format:check` exits 0
- [ ] `npm run build` exits 0
- [ ] `npm run preview` serves the production build and both routes render
- [ ] Build output contains the expected `vendor` and `animation` chunks
- [ ] No unexpected chunk-size warnings
- [ ] `package.json` still lists exactly three runtime dependencies, or any
      addition was explicitly approved (CLAUDE.md §18)
- [ ] No `tailwind.config.js` exists
- [ ] No `postcss.config.js` with a `tailwindcss` plugin exists
- [ ] No `.ts` or `.tsx` file exists under `src/`
- [ ] `git status`-equivalent inspection shows nothing changed under
      `inspiration/`, `.agents/skills/` or `.claude/skills/`

---

## 2. Functional Tests

### Home route

- [ ] The page renders with no console errors or warnings
- [ ] Navbar shows the availability pill, four links with counters, and the CTA
- [ ] Hero wordmark renders with the first word outlined and the second solid
- [ ] Portrait renders at the correct z-order relative to the wordmark
- [ ] Role block shows subtitle, description and CTA
- [ ] Social rail renders four equal-width pills
- [ ] Selected Work renders every project from `projects.js`
- [ ] Service renders every service from `services.js`
- [ ] Experience renders every role from `experience.js`
- [ ] Contact renders the CTA block — **and no form**
- [ ] Footer renders the name pill and four social pills
- [ ] Every social link opens the correct URL
- [ ] `Let's Talk`, `Let's collaborate` and `Contact Me` all resolve to the
      contact destination

### Filters

- [ ] `All` shows every project
- [ ] `Real Project` shows only real projects
- [ ] `Exploration` shows only explorations
- [ ] The active filter is visually distinguishable
- [ ] The active filter is reflected in the URL
- [ ] Reloading with a filter in the URL restores that filter
- [ ] A filter matching nothing renders a deliberate empty state, not a blank gap

### Service accordion

- [ ] Clicking a collapsed row expands it
- [ ] Clicking the `×` collapses it
- [ ] Enter and Space operate the trigger
- [ ] `aria-expanded` matches the visible state
- [ ] The expanded panel shows title, description, media and `×`
- [ ] The media card overhangs the panel's top edge
- [ ] Rows below reflow correctly as the panel opens and closes
- [ ] Opening a second row behaves per the chosen single/multi-open policy

### Project detail route

- [ ] Clicking a project card navigates to its detail route
- [ ] The URL contains the project slug
- [ ] The browser back button returns to the home route
- [ ] `← Back` returns to the home route
- [ ] Cmd/Ctrl-click and middle-click open the card in a new tab
- [ ] The page scrolls to the top on navigation
- [ ] Header, meta stack, media showcase, caption and `/MORE WORK` all render
- [ ] `/MORE WORK` excludes the currently open project
- [ ] `Live Preview` opens the external URL
- [ ] An unknown slug renders `NotFound` rather than crashing
- [ ] Deep-linking directly to a detail URL works on a cold load

---

## 3. Navigation Tests

- [ ] Each nav link scrolls to its matching section
- [ ] Each section lands with correct `scroll-margin-top` offset
- [ ] The navbar is **not** sticky — it scrolls away and does not return
      (design.md §8)
- [ ] No scroll-spy, underline animation or progress indicator was added
- [ ] Nav links are real `<a>` elements
- [ ] Mobile: the disclosure menu opens and closes
- [ ] Mobile: Escape closes the menu and focus returns to the trigger
- [ ] Mobile: selecting a link closes the menu and scrolls to the section
- [ ] Mobile: focus is trapped inside the open menu

---

## 4. Responsive Tests

Test matrix — every section at every width:

| Width | Label                  | Hero | Work | Service | Experience | Contact | Detail |
| ----- | ---------------------- | ---- | ---- | ------- | ---------- | ------- | ------ |
| 1920  | Large desktop          | [ ]  | [ ]  | [ ]     | [ ]        | [ ]     | [ ]    |
| 1440  | **Reference baseline** | [ ]  | [ ]  | [ ]     | [ ]        | [ ]     | [ ]    |
| 1280  | Small desktop          | [ ]  | [ ]  | [ ]     | [ ]        | [ ]     | [ ]    |
| 1024  | Landscape tablet       | [ ]  | [ ]  | [ ]     | [ ]        | [ ]     | [ ]    |
| 768   | Portrait tablet        | [ ]  | [ ]  | [ ]     | [ ]        | [ ]     | [ ]    |
| 430   | Large phone            | [ ]  | [ ]  | [ ]     | [ ]        | [ ]     | [ ]    |
| 375   | Small phone            | [ ]  | [ ]  | [ ]     | [ ]        | [ ]     | [ ]    |

At every width:

- [ ] No horizontal page scrollbar
- [ ] `document.documentElement.scrollWidth <= clientWidth`
- [ ] No text clipped or overlapping
- [ ] No element escapes its container
- [ ] Wide content (media, tables) scrolls inside its own container
- [ ] Touch targets are at least 44 × 44 px below 768 px
- [ ] `100dvh` sections behave correctly with mobile browser chrome
- [ ] Long project titles wrap rather than overflow
- [ ] Long tag lists wrap rather than overflow

---

## 5. Animation Tests

### Entrance

- [ ] The hero entrance runs once on load in the measured order:
      nav → wordmark → role block + social rail → portrait
- [ ] Nothing flashes at full opacity before its animation starts
- [ ] The entrance does not replay when scrolling back to the top
- [ ] Total entrance settles in roughly 2 s, matching the reference feel

### Scroll reveal

- [ ] Each section reveals as it enters the viewport, not on page load
- [ ] Section headings lead their children
- [ ] Service rows stagger top-to-bottom at ~130 ms
- [ ] Project cards stagger
- [ ] Experience rows stagger
- [ ] Reveals do not re-run on every scroll pass unless intended
- [ ] Content below the fold is present in the DOM for search and screen readers

### Interaction

- [ ] Hovering a project card fades in the circular `↗` button
- [ ] The button follows the pointer with a visible trailing lag
- [ ] The button disappears on pointer-leave
- [ ] Hovering an experience row reveals the rotated thumbnail
- [ ] The thumbnail follows the pointer with a visible trailing lag
- [ ] The thumbnail disappears on pointer-leave
- [ ] Accordion open/close motion matches the ~430–700 ms reference timing
- [ ] Animations are interruptible — rapid hover in/out does not desync

### Reduced motion

Enable the OS `prefers-reduced-motion: reduce` setting for all of these.

- [ ] The hero renders fully and correctly with no entrance animation
- [ ] Every section is fully visible without scrolling to trigger it
- [ ] No element is stuck at `opacity: 0` or an off-screen transform
- [ ] Pointer-following behaviours are disabled
- [ ] The accordion still opens and closes, without transition
- [ ] `scroll-behavior` is `auto`, not `smooth`
- [ ] The site is fully usable end to end

### Correctness audit

- [ ] `grep` finds no `animate(` call inside `src/components/` or
      `src/features/**/components/`
- [ ] `grep` finds no `top`, `left`, `width` or `height` in any animation config
- [ ] `grep` finds no `window.addEventListener('scroll'`
- [ ] `grep` finds no GSAP, Framer Motion, Motion One, React Spring or AOS import
- [ ] Every `createScope` has a matching `revert()` in its cleanup
- [ ] Every `pointermove` listener is removed on unmount
- [ ] Unmounting a section leaves no running animation (verified by navigating
      between routes repeatedly and watching for leaks)
- [ ] No dropped frames during the hero entrance on a mid-range machine

---

## 6. Accessibility Tests

### Structure

- [ ] Exactly one `<h1>` per route
- [ ] No heading level is skipped
- [ ] `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>` used correctly
- [ ] No `<div>` or `<span>` carries a click handler
- [ ] Every watermark is `aria-hidden="true"`
- [ ] Decorative icons are `aria-hidden="true"`
- [ ] Icon-only controls have an `aria-label`

### Keyboard

- [ ] Tab reaches every interactive element in a sensible order
- [ ] Every focused element has a visible focus indicator
- [ ] No element removes its outline without a replacement
- [ ] Accordion rows operate with Enter and Space
- [ ] Filters operate with Enter and Space
- [ ] Project cards are focusable and activate with Enter
- [ ] Mobile menu traps focus while open and restores it on close
- [ ] No keyboard trap anywhere on either route

### Screen reader

- [ ] Section names are not announced twice (watermark suppression works)
- [ ] Accordion state is announced via `aria-expanded`
- [ ] Filter state is announced via `aria-pressed`
- [ ] Project links announce a meaningful name, not "link"
- [ ] Images have descriptive `alt`; decorative images have `alt=""`

### Contrast

- [ ] Body copy `#545454` on `#FCFCFC` — expect ≥ 4.5:1
- [ ] Display ink `#242424` on `#FCFCFC` — expect ≥ 4.5:1
- [ ] `#A5A5A5` on `#242424` — expect ≥ 4.5:1
- [ ] Nav counters meet 4.5:1 **or** are `aria-hidden` with the count available
      elsewhere (design.md §19)
- [ ] Hairline borders meet 3:1 where they carry meaning
- [ ] Focus rings meet 3:1 against both light and dark backgrounds

---

## 7. Visual Tests

Compare the running site side by side with each reference file at a
1440 × 982 viewport.

| Reference        | Section    | Check                                                          | Result |
| ---------------- | ---------- | -------------------------------------------------------------- | ------ |
| `home.webp`      | Hero       | Wordmark scale, outline weight, portrait placement, rail width | [ ]    |
| `home.webp`      | Navbar     | Pill shapes, counter styling, CTA fill                         | [ ]    |
| `service.webp`   | Service    | Row pitch, title scale, panel radius, media overhang           | [ ]    |
| `project.webp`   | Work       | Grid gap, card radius, badge, chip styling, watermark          | [ ]    |
| `experience.png` | Experience | Panel margin, row rhythm, dark tokens, watermark               | [ ]    |
| `contact.webp`   | Contact    | Heading scale, copy width, footer distribution                 | [ ]    |
| video t=18.6     | Detail     | Two-column header, meta stack, button pair                     | [ ]    |

Specific checks:

- [ ] Colour spot-check: sample the rendered page and compare against the
      design.md §4 token values
- [ ] Container widths measure 1280 / 1216 / 1104 at a 1440 viewport
- [ ] Projects grid gap measures ~56 px
- [ ] Service row pitch measures ~188 px
- [ ] Both font families render, with the display/UI distinction visible
- [ ] Ghost watermarks are visible but very low contrast
- [ ] No purple/blue gradient, glassmorphism or arbitrary drop shadow appeared
      (CLAUDE.md §7)
- [ ] No emoji anywhere in markup, copy or alt text
- [ ] No placeholder names, Lorem Ipsum or AI copywriting clichés

---

## 8. Performance Tests

- [ ] Every `<img>` has explicit `width` and `height`
- [ ] Cumulative layout shift is visually zero on load and on scroll
- [ ] Below-fold images use `loading="lazy"`
- [ ] The hero portrait is prioritised, not lazy
- [ ] Images are served in a modern format at sensible dimensions
- [ ] Fonts (if linked) use `font-display: swap` with `preconnect`
- [ ] No layout reads (`getBoundingClientRect`, `offsetHeight`) inside render
- [ ] Pointer-follow handlers do not thrash layout
- [ ] Production bundle size is reasonable and chunked as configured
- [ ] The hero entrance holds 60 fps

---

## 9. Browser Tests

| Browser          | Home | Detail | Animation | Text stroke | Result |
| ---------------- | ---- | ------ | --------- | ----------- | ------ |
| Chrome (latest)  | [ ]  | [ ]    | [ ]       | [ ]         |        |
| Firefox (latest) | [ ]  | [ ]    | [ ]       | [ ]         |        |
| Safari (latest)  | [ ]  | [ ]    | [ ]       | [ ]         |        |
| Edge (latest)    | [ ]  | [ ]    | [ ]       | [ ]         |        |
| iOS Safari       | [ ]  | [ ]    | [ ]       | [ ]         |        |
| Android Chrome   | [ ]  | [ ]    | [ ]       | [ ]         |        |

Specific risks:

- [ ] `-webkit-text-stroke` renders on the wordmark in every browser, or the
      `@supports` fallback engages
- [ ] `100dvh` behaves on iOS Safari with dynamic browser chrome
- [ ] `grid-template-rows: 0fr → 1fr` transitions in every target browser
- [ ] `object-fit: cover` behaves in every media frame
- [ ] The site is usable without JavaScript animations if they fail to start

---

## 10. Regression Tests

Run after any change to a shared primitive or the animation layer.

- [ ] Existing `Button` focus-visible ring still works in every variant
- [ ] Existing `Container` default (`base`) behaviour is unchanged
- [ ] `Card` primitive still renders wherever it is used
- [ ] `useAnimation` and `useAnimationOnHover` still behave as before
- [ ] Existing presets (`fadeIn`, `slideUp`, `scaleIn`, `staggerIn`) are unchanged
- [ ] `NotFound` still renders
- [ ] Adding a project to `projects.js` requires no JSX change
- [ ] Adding a service to `services.js` requires no JSX change
- [ ] Adding an experience row requires no JSX change
- [ ] Removing every project renders an empty state rather than a crash
- [ ] Reduced-motion behaviour survived the change

---

## 10a. Asset and Content Tests

Added after the owner's real media and content landed. The originals live in
`information/source-assets/` and are never served; run these whenever an asset
or a data file changes.

| # | Check | Method | Expected |
|---|---|---|---|
| A1 | Every referenced asset resolves | Load both routes and read `document.images`; assert `complete && naturalWidth > 0` for every image with a non-zero box | No broken image at any viewport |
| A2 | No 4xx on any request | CDP `Network.responseReceived` over a full route and viewport sweep | Zero responses >= 400 |
| A3 | Derivatives are current | `python scripts/build-assets.py`, then `git status` | No unexpected diff under `src/assets/images/` |
| A4 | Shipped image weight | Read the Vite build output | Total emitted image bytes stay under ~500 KB |
| A5 | Outbound links resolve | `curl -sL -o /dev/null -w '%{http_code}'` on every URL in `data/` | 200, or the entry carries `liveUrl: null` |
| A6 | No placeholder copy | `grep -rniE "todo\|lorem\|dummy\|example\.com\|placeholder\|pending"` over `src/` | No match in shipped strings |
| A7 | Neutral frames are labelled | Render a project with `thumbnail: null` | Frame carries the project's name, not a "pending" label |
| A8 | Text never sits over the portrait | Measure `[data-hero-role]` right edge against `[data-hero-portrait] img` left edge at 1024, 1280 and 1440 | Role block right edge is left of the portrait box |
| A9 | Detail media shows the whole capture | Load a detail route with a tall device capture | `object-fit: contain`; the full screen is visible and undistorted |
| A10 | Entrance order survives asset changes | Sample `opacity` per animation frame for the five hero targets | nav ~0 ms, wordmark ~200 ms, role and rail ~580 ms, portrait ~1150 ms |

**Note on A1.** Images inside a collapsed accordion panel or a `hidden`
breakpoint variant report `naturalWidth === 0` because the browser never fetches
them. That is correct lazy behaviour, not a failure - the assertion only applies
to images with a non-zero bounding box.

**Tooling.** No ffmpeg and no Puppeteer are installed. The reference video is
decoded by loading it into the headless browser and drawing seeked frames to a
canvas; the browser itself is driven over the DevTools Protocol through Node's
built-in `WebSocket`. Both are viable substitutes and neither adds a dependency.

---

## 10b. Production Hardening Tests

Added in Phase 14. Unlike every other section here, these run against the
**production build** (`npm run build` then `npm run preview`), not the dev
server — several of them can only fail in a production bundle.

### Build output

| # | Check | Method | Expected |
| --- | --- | --- | --- |
| P1 | No source original ships | `find dist -name '*.png'` | Only files the browser requests by literal path; **no capture or portrait original** |
| P2 | `public/` holds only served files | `ls public/` | `favicon.svg` and `robots.txt`, nothing else |
| P3 | Derivatives unchanged by a pipeline edit | `md5sum src/assets/images/*.webp` before and after `python scripts/build-assets.py` | Byte-identical; a path change must not re-encode a pixel |
| P4 | `dist/` weight | `du -sb dist` | Under ~1 MB; a jump means something entered `public/` |
| P5 | Chunks match config | Read the build output | `vendor`, `router`, `animation`, `index`, `ProjectDetail`; no chunk-size warning |
| P6 | No secret, no dev URL | `grep -r "localhost\|127.0.0.1\|API_KEY\|SECRET\|TOKEN" dist/` | Only third-party library internals; nothing of ours |

### Runtime, on the production build

| # | Check | Method | Expected |
| --- | --- | --- | --- |
| P7 | Zero `.png` requests | CDP `Network.responseReceived` across every route | No response URL ends `.png` |
| P8 | Console is clean | CDP `Runtime.consoleAPICalled`, `Runtime.exceptionThrown`, `Log.entryAdded` per route, per viewport, before and after a full scroll | Zero entries. Never suppress — fix the cause |
| P9 | Lazy images all resolve | Scroll the full page, then assert `complete && naturalWidth > 0` for every image with a non-zero box | Zero broken (see the 10a A1 note on collapsed panels) |
| P10 | Hero portrait is not lazy | Read `loading` and `fetchpriority` on `[data-hero-portrait] img` | `eager` and `high` — it is on the LCP path |
| P11 | Unknown slug degrades | Load `/no-such-page` and an unknown project slug | `NotFound` renders with one `h1` and its own title; no crash |

### Metadata

| # | Check | Method | Expected |
| --- | --- | --- | --- |
| P12 | Per-route document title | Navigate each route and read `document.title` | Three distinct titles; a project route names the project (WCAG 2.4.2) |
| P13 | Social metadata is honest | Read `index.html` | `og:*` and `twitter:*` present; **no `og:url`, `canonical` or `og:image`** while the deployment domain is unknown — a fabricated URL is worse than an absent tag |

### Accessibility, measured rather than eyeballed

| # | Check | Method | Expected |
| --- | --- | --- | --- |
| P14 | Contrast | Compute the WCAG ratio for every distinct text-on-background pair, resolving alpha up the ancestor chain | Zero pairs below 4.5:1 body / 3:1 large |
| P15 | Focus is visible under real keyboard focus | Tab with synthesised key events; at each stop read computed `outline` and `box-shadow` | Every stop shows an indicator. **Do not test with `el.focus()`** — programmatic focus does not reliably match `:focus-visible` and reports false failures |
| P16 | No keyboard trap | Tab through the whole route | Focus wraps to the document; every stop is reachable and leavable |
| P17 | Skip link is usable when focused | Tab once, measure the focused rect | At least 44 px tall. `not-sr-only` resets `padding`, so the box has to be restated under the `focus:` variant |
| P18 | Touch targets | Measure every interactive rect at 768 / 430 / 375 | At least 44 × 44 where touch applies. Desktop-only nav links at ≥1024 are mouse targets and need only WCAG 2.5.8's 24 × 24 |
| P19 | Mobile disclosure | At 430 px: open, read `inert` and `aria-expanded`, press Escape | `inert` while closed; Escape closes it and returns focus to the trigger |

### Motion

| # | Check | Method | Expected |
| --- | --- | --- | --- |
| P20 | Reduced motion strands nothing | Force `prefers-reduced-motion: reduce` at the browser, scroll both routes fully, then assert no element carrying text or an image sits at opacity < 0.05 or translated > 8 px | Zero stranded elements; zero infinite animations |
| P21 | Reduced motion disables Anime.js, not just CSS | Confirm every hook returns before `createScope` | No scope is created at all |
| P22 | Pointer-follow does not thrash | Patch `Element.prototype.getBoundingClientRect` to count calls, then sweep a synthesised pointer across a row | 1 read on `pointerenter`, **0** across subsequent moves |
| P23 | Pointer-follow does not re-render | `MutationObserver` for non-`style` mutations during the sweep | Zero |
| P24 | Coarse pointers are gated out | Emulate touch at 430 px | `(hover: hover) and (pointer: fine)` is false; no listener is bound; followers stay at opacity 0 |

### Regression

| # | Check | Method | Expected |
| --- | --- | --- | --- |
| P25 | Container widths survive optimisation | Measure the four `Container` variants at 1440 | 1280 / 1216 / 1104 / 1408, gutter 80, grid gap 56 |
| P26 | Card grid stays uniform after a copy change | Measure every project card box and title line count | All identical; a title that wraps to a second line is a layout change, not a copy change |
| P27 | Entrance order survives | Sample the five hero targets per frame | nav → wordmark → role + rail → portrait, with elements in their authored final state until their tween starts |

**Deployment note.** `npm run preview` rewrites unmatched paths to
`index.html`, so SPA deep links always pass locally. That is a property of the
preview server, not of the build — the host needs its own rewrite or
`/project/<slug>` returns a 404 in production. See README.md § Deployment.

---

## 11. Final Acceptance Criteria

The reconstruction is accepted when all of the following hold:

- [ ] Every section in [design.md](design.md) is implemented
- [ ] Both routes work, including deep links and the back button
- [ ] Side-by-side visual comparison against all five reference images is a
      close match at 1440 px
- [ ] The motion language matches the video: slow, decelerating, ~130 ms stagger
- [ ] Both pointer-following interactions work and are pointer-gated
- [ ] Nothing marked NOT OBSERVED in design.md §17 was invented
- [ ] Every discrepancy in design.md §17 was resolved as documented
- [ ] Every responsive behaviour is implemented and labelled as inferred
- [ ] The full accessibility section passes
- [ ] Reduced motion produces a complete, usable, correct page
- [ ] `lint`, `format:check` and `build` all pass
- [ ] No forbidden behaviour from CLAUDE.md §17 occurred
- [ ] All reference content has been replaced with the owner's real content
- [ ] [plan.md](plan.md) checkboxes reflect reality, with deferrals stated
- [ ] Anything not verified is stated plainly as not verified
- [ ] Section 10b passes against the **production build**, not the dev server
- [ ] The host's SPA rewrite is configured, so `/project/<slug>` survives a
      refresh and a deep link
