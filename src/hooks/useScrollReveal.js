import { useRef, useLayoutEffect } from 'react';
import { animate, createScope, utils } from 'animejs';
import { shouldReduceMotion } from '@/animations/utils/animationUtils';

// A scroll-triggered sibling of useAnimation. The existing hook fires
// unconditionally on mount, which is wrong for content below the fold.
//
// Built on IntersectionObserver rather than Anime.js onScroll(). Both are
// sanctioned (CLAUDE.md section 8 rule 7, rule.md Rule 5), but onScroll with
// repeat:false proved unsafe here: scrolling past a section faster than its
// stagger could complete tore the observer down mid-sequence and left the
// children that had not yet reached their delay permanently at opacity 0.
// A one-shot IntersectionObserver cannot strand content that way - it fires,
// starts the animation, and disconnects, and the animation always runs to
// completion on its own clock.
//
// `selector` targets descendants of the ref for staggered groups; omit it to
// animate the root element itself.

// Fires slightly before the element reaches the viewport edge so the reveal
// reads as the section arriving rather than correcting itself once on screen.
const ROOT_MARGIN = '0px 0px -8% 0px';

export const useScrollReveal = (animationConfig, { selector } = {}) => {
  const ref = useRef(null);
  const configRef = useRef(animationConfig);
  const selectorRef = useRef(selector);

  // useLayoutEffect so anything below the fold is hidden before the browser
  // paints rather than flashing at full opacity and then dropping out.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || shouldReduceMotion()) {
      return undefined;
    }

    const targets = selectorRef.current
      ? Array.from(root.querySelectorAll(selectorRef.current))
      : [root];

    if (targets.length === 0) {
      return undefined;
    }

    const config = configRef.current;
    // Read the from-state out of the preset instead of restating it, so the
    // hidden state and the animation can never drift apart.
    const fromOpacity = Array.isArray(config.opacity)
      ? config.opacity[0]
      : null;
    const fromY = Array.isArray(config.translateY)
      ? config.translateY[0]
      : null;

    // Only pre-hide what is genuinely off screen. A section already in view on
    // load stays visible and simply does not animate, which is both correct and
    // what a visitor who lands mid-page expects.
    const alreadyInView = root.getBoundingClientRect().top < window.innerHeight;

    let scope = null;
    let observer = null;

    if (!alreadyInView) {
      // The pre-hide runs inside the scope so revert() owns the inline styles
      // it writes; utils.set builds a zero-duration animation, which registers
      // with the active scope exactly like animate() does.
      scope = createScope({ root }).add((self) => {
        if (fromOpacity !== null) {
          utils.set(targets, { opacity: fromOpacity });
        }
        if (fromY !== null) {
          utils.set(targets, { translateY: fromY });
        }
        self.add('reveal', () => animate(targets, config));
      });

      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) {
            return;
          }
          // One shot: disconnect first so a re-entry cannot restart a sequence
          // that is already running.
          observer.disconnect();
          observer = null;
          scope?.methods.reveal();
        },
        { rootMargin: ROOT_MARGIN, threshold: 0 }
      );
      observer.observe(root);
    }

    return () => {
      observer?.disconnect();
      // revert() stops any running animation and strips the inline opacity and
      // transform written above, so an unmount can never leave content hidden.
      scope?.revert();
    };
  }, []);

  return ref;
};

export default useScrollReveal;
