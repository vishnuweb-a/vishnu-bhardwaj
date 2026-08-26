// Entrance presets carrying the distances, durations and easing measured from
// portfolio.annimation.mp4 (design.md section 18). The reference's motion is
// slow, heavily decelerated and travels a long way; outExpo reproduces the
// measured ~0.70 per-frame decay ratio of the social rail almost exactly.
//
// Every factory spreads ...options last so a caller can override any field.

export const EASE_OUT = 'outExpo';

// Top-anchored content descends into place. Navbar: -31px over ~750ms.
export const revealDown = (options = {}) => ({
  translateY: [-31, 0],
  opacity: [0, 1],
  duration: 750,
  ease: EASE_OUT,
  ...options,
});

// Bottom-anchored content rises. The default 70px/460ms matches the hero role
// block; the portrait and social rail pass their own measured distances.
export const revealUp = (options = {}) => ({
  translateY: [70, 0],
  opacity: [0, 1],
  duration: 460,
  ease: EASE_OUT,
  ...options,
});

// The measured scroll-reveal: a shorter rise over a longer ramp. Used for
// section headings and any single element entering the viewport.
export const revealOnScroll = (options = {}) => ({
  translateY: [48, 0],
  opacity: [0, 1],
  duration: 800,
  ease: EASE_OUT,
  ...options,
});
