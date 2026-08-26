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
