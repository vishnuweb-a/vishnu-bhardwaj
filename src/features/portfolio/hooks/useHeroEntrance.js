import { useLayoutEffect, useRef } from 'react';
import { createScope, createTimeline } from 'animejs';
import { shouldReduceMotion } from '@/animations';

// The measured hero entrance (design.md section 18). Timings are relative to
// T0 = video t=0.85s and distances are CSS pixels at the 1440px baseline:
//
//   navbar      delay    0ms  translateY -31 -> 0  over ~750ms
//   wordmark    delay  200ms  translateY -66 -> 0  over ~700ms
//   role block  delay  580ms  translateY +70 -> 0  over ~460ms
//   social rail delay  580ms  translateY +170 -> 0 over ~720ms
//   portrait    delay 1150ms  translateY +384 -> 0 over ~850ms, slight scale-up
//
// The social rail translates as one locked group. Centroid tracking showed all
// four pills moving in lockstep at a fixed pitch; the apparent per-pill stagger
// in the static frames was a measurement artefact (design.md section 17, row 6).
//
// outExpo reproduces the measured 0.70 per-frame decay ratio. One timeline in
// one scope keeps the whole sequence revertible in a single call.
const ELEMENTS = {
  nav: '[data-hero-nav]',
  wordmark: '[data-hero-wordmark]',
  role: '[data-hero-role]',
  rail: '[data-hero-rail]',
  portrait: '[data-hero-portrait]',
};

export const useHeroEntrance = () => {
  const ref = useRef(null);

  // useLayoutEffect, not useEffect: the timeline's from-values have to be
  // written before the browser paints, otherwise the hero flashes at full
  // opacity for one frame. Elements stay authored in their final visual state,
  // so the reduced-motion path below still renders a complete page.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || shouldReduceMotion()) {
      return undefined;
    }

    const scope = createScope({ root }).add(() => {
      const timeline = createTimeline({
        defaults: { ease: 'outExpo' },
      });

      timeline
        .add(
          ELEMENTS.nav,
          { translateY: [-31, 0], opacity: [0, 1], duration: 750 },
          0
        )
        .add(
          ELEMENTS.wordmark,
          { translateY: [-66, 0], opacity: [0, 1], duration: 700 },
          200
        )
        .add(
          ELEMENTS.role,
          { translateY: [70, 0], opacity: [0, 1], duration: 460 },
          580
        )
        .add(
          ELEMENTS.rail,
          { translateY: [170, 0], opacity: [0, 1], duration: 720 },
          580
        )
        .add(
          ELEMENTS.portrait,
          {
            translateY: [384, 0],
            scale: [0.94, 1],
            opacity: [0, 1],
            duration: 850,
            ease: 'outQuart',
          },
          1150
        );
    });

    return () => scope.revert();
  }, []);

  return ref;
};

export default useHeroEntrance;
