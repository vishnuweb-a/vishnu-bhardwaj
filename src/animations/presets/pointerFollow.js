// Configuration for the site's two pointer-following elements: the project
// card's circular arrow button and the experience row's tilted thumbnail
// (design.md sections 11, 12). Both were measured tracking the cursor at a
// roughly constant offset with a visible lag.
//
// These are createAnimatable parameter objects, not animate() configs. The
// per-property duration plus a decelerating ease is what produces the damped
// trail - a manual requestAnimationFrame loop is neither needed nor allowed
// (rule.md Rule 5).

// Longer duration = more lag. 320ms reads as premium without feeling detached.
export const pointerFollow = (options = {}) => ({
  x: 320,
  y: 320,
  ease: 'outQuad',
  ...options,
});

// The experience thumbnail sits further from the pointer and trails a little
// more heavily than the card button.
export const pointerFollowSoft = (options = {}) => ({
  x: 460,
  y: 460,
  ease: 'outQuad',
  ...options,
});

// The fade/scale that brings a follower in and out. Transform and opacity only.
export const followerIn = (options = {}) => ({
  opacity: [0, 1],
  scale: [0.7, 1],
  duration: 260,
  ease: 'outExpo',
  ...options,
});

export const followerOut = (options = {}) => ({
  opacity: 0,
  scale: 0.7,
  duration: 200,
  ease: 'outQuad',
  ...options,
});
