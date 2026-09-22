// Motion vocabulary for the BYTE companion.
//
// Every factory returns a plain Anime.js v4 config and spreads ...options last,
// matching the contract of every other preset in this directory. Only
// `transform` and `opacity` are animated, so nothing here triggers layout.
//
// BYTE's world position is written by its controller through createAnimatable;
// these presets animate the *inner* body element, which owns a separate
// transform from the outer positioned shell. Keeping the two on different
// elements is what lets a gesture play while the pet is still travelling.

import { createSpring } from 'animejs';

// The travel settle. Slightly under-damped so arrival overshoots and rocks
// back rather than stopping dead, which is what reads as weight.
export const byteSettle = () =>
  createSpring({ stiffness: 120, damping: 14, mass: 1 });

// The release spring after a drag - stiffer, because a thrown object should
// stop arguing with the cursor quickly.
export const byteRelease = () =>
  createSpring({ stiffness: 180, damping: 18, mass: 1 });

// Arrival compression: the body squashes against the floor, then recovers.
// scaleY only - a uniform scale would read as a zoom rather than an impact.
export const byteLand = (options = {}) => ({
  scaleY: [
    { to: 0.94, duration: 110 },
    { to: 1, duration: 260 },
  ],
  scaleX: [
    { to: 1.05, duration: 110 },
    { to: 1, duration: 260 },
  ],
  ease: 'outQuad',
  ...options,
});

// The walk cycle's vertical bounce, looped for the duration of a trip. Three
// pixels is deliberately small: the shell is already moving, so this only has
// to suggest footfalls rather than carry the motion.
export const byteWalkBounce = (options = {}) => ({
  translateY: [0, -3, 0],
  duration: 340,
  loop: true,
  ease: 'inOutSine',
  ...options,
});

// A happy hop on click.
export const byteHop = (options = {}) => ({
  translateY: [
    { to: -14, duration: 180 },
    { to: 0, duration: 320 },
  ],
  ease: 'outQuad',
  ...options,
});

// Tiny side-to-side wiggle. Rotation rather than translation so the paws stay
// planted.
export const byteWiggle = (options = {}) => ({
  rotate: [0, -7, 7, -4, 0],
  duration: 520,
  ease: 'inOutSine',
  ...options,
});

// The rare double-click celebration: a full rotation with a hop under it.
export const byteSpin = (options = {}) => ({
  rotate: [0, 360],
  translateY: [
    { to: -18, duration: 260 },
    { to: 0, duration: 340 },
  ],
  duration: 600,
  ease: 'inOutQuad',
  ...options,
});

// Stretch - a long yawn-adjacent gesture used awake, and on the way to sleep.
export const byteStretch = (options = {}) => ({
  scaleY: [
    { to: 1.1, duration: 320 },
    { to: 1, duration: 380 },
  ],
  scaleX: [
    { to: 0.94, duration: 320 },
    { to: 1, duration: 380 },
  ],
  ease: 'inOutSine',
  ...options,
});

// Sitting down for sleep: the body lowers and widens slightly.
export const byteSit = (options = {}) => ({
  scaleY: 0.92,
  scaleX: 1.04,
  translateY: 4,
  duration: 420,
  ease: 'outQuad',
  ...options,
});

// Standing back up. The explicit targets return the body to neutral, because
// byteSit leaves persistent values rather than a round trip.
export const byteStand = (options = {}) => ({
  scaleY: 1,
  scaleX: 1,
  translateY: 0,
  duration: 300,
  ease: 'outBack',
  ...options,
});

// A shallow dizzy spin for the skills reaction - half the amplitude of the
// celebration spin, and it rocks back rather than completing the turn.
export const byteDizzy = (options = {}) => ({
  rotate: [0, 22, -22, 14, -8, 0],
  duration: 900,
  ease: 'inOutSine',
  ...options,
});

// Speech bubble entrance and exit. Authored to animate in from the pet's
// shoulder, so the transform origin belongs on the element.
export const byteBubbleIn = (options = {}) => ({
  opacity: [0, 1],
  scale: [0.8, 1],
  translateY: [6, 0],
  duration: 260,
  ease: 'outBack',
  ...options,
});

export const byteBubbleOut = (options = {}) => ({
  opacity: [1, 0],
  scale: [1, 0.9],
  duration: 180,
  ease: 'outQuad',
  ...options,
});
