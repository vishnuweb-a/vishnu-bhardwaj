import { usePointerWipe } from '@/hooks';
import { assets } from '../data';

// Background-removed cutout, bottom-anchored, sitting in front of the
// wordmark's baseline with the head crown clearing it by only a few pixels
// (design.md section 9, [measured]).
//
// The shipped file is a head-shoulders-and-chest crop of the owner's portrait,
// cut to the reference's framing by scripts/build-assets.py. Its lower edge is
// a hard cut that lands on the viewport's bottom edge, which is what the
// reference does too.
//
// The reference portrait is close to monochrome. This one is not - a loud plaid
// shirt would be the only saturated colour on an otherwise ink-and-paper page -
// so it is desaturated to sit inside the palette (rule.md Rule 2) without
// draining the skin tones.
//
// Below lg the cutout comes out of the absolute layer and sits in flow between
// the wordmark and the lower band. Bottom-anchoring it there would put a face
// and a patterned shirt directly behind the role paragraph and the social
// pills, which is a contrast failure rather than a composition (rule.md
// Rule 12). Inferred responsive behaviour, as everything below 1280 is
// (design.md section 16).
//
// The left padding at lg and above nudges the centred figure clear of the role
// paragraph. This cutout's shoulders spread wider and further left than the
// reference's, so centring it exactly would run the shirt under the last words
// of the intro; the reference's own portrait sits about 100px right of the
// viewport centre for the same reason.
//
// No `src` guard: the file is imported through the data layer, so a missing
// asset fails the build rather than degrading silently at runtime.

// Both layers are the same element box, so the curtain's inset-0 lines up with
// the base image to the pixel and the two stay registered at every breakpoint.
//
// The vh heights are the intended figure scale; the max-height is the ceiling
// that keeps the crown clear of the wordmark on a wide, short window, where the
// width-driven wordmark grows into the height-driven cutout's space. It only
// binds at lg and above, which is where the two share a band at all - see
// --hero-portrait-max-height in src/styles/index.css.
const PORTRAIT_BOX =
  'h-[32vh] w-auto max-w-[72vw] object-contain object-bottom sm:h-[38vh] lg:h-[50vh] lg:max-h-[var(--hero-portrait-max-height)] xl:h-[62vh]';

export const HeroPortrait = () => {
  const { containerRef, curtainRef, contentRef } = usePointerWipe();

  return (
    <div
      data-hero-portrait
      className="relative z-10 mt-10 flex justify-center lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:pl-12 xl:pl-16"
    >
      {/* The outer band stays pointer-transparent at lg so the role block and
          social rail underneath it keep their hit areas; the wipe needs events,
          so they are handed back on the portrait's own box alone. */}
      <div ref={containerRef} className="pointer-events-auto relative">
        <img
          src={assets.portrait}
          alt={assets.portraitAlt}
          width={880}
          height={800}
          // Above the fold and part of the entrance - never lazy.
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={`${PORTRAIT_BOX} grayscale-[0.85]`}
        />

        {/* The colour layer. Hidden until the cursor is inside the cutout and
            hidden for good on coarse pointers and under reduced motion, so this
            is decorative duplication of an image the page has already announced
            - hence aria-hidden and the empty alt.

            opacity is set inline rather than with a utility because
            usePointerWipe writes the same property; leaving Tailwind's
            opacity-0 in the class list would fight the inline style the scope
            sets and revert()s. */}
        <div
          ref={curtainRef}
          aria-hidden="true"
          style={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <img
            ref={contentRef}
            src={assets.portrait}
            alt=""
            width={880}
            height={800}
            // Same URL as the base image, so this resolves from cache and costs
            // a decode rather than a second download.
            loading="eager"
            decoding="async"
            className={PORTRAIT_BOX}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroPortrait;
