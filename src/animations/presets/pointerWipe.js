// Configuration for the hero portrait's colour reveal (design.md section 9).
//
// Measured from video t=3.05-3.97: the cutout sits desaturated until the
// cursor enters it, at which point a full-colour copy is uncovered by a hard
// vertical edge that chases the pointer's x. Everything to the right of that
// edge is in colour; everything to the left stays desaturated.
//
// The edge does not snap to the cursor. With the pointer parked at x~650 the
// measured edge walked 920 -> 652 px over roughly 520 ms, each 16 ms frame
// closing about 15 percent of the remaining gap - an exponential settle, not a
// linear sweep. That is the same damped follow createAnimatable already gives
// the two pointer-following elements, so this is a createAnimatable parameter
// object like pointerFollow, not an animate() config (rule.md Rule 5).

// 400 ms outExpo reproduces the measured ~520 ms settle with the long tail the
// recording shows.
//
// Both axes are declared even though only one is ever driven at a time. The
// recording only ever enters the cutout from the right, but the shipped wipe
// works from whichever edge the pointer actually crosses (an explicit request,
// beyond what the reference shows): entering from the left or the right gives a
// vertical edge on `x`, entering from the top or the bottom a horizontal one on
// `y`. The idle axis is parked at 0.
export const pointerWipe = (options = {}) => ({
  x: 400,
  y: 400,
  ease: 'outExpo',
  ...options,
});

// The colour layer is switched on, not faded in - the wipe itself is the
// transition, so a crossfade on top of it would only muddy the edge.
export const wipeIn = (options = {}) => ({
  opacity: 1,
  duration: 0,
  ...options,
});

// On pointerleave the reference cuts the colour in a single frame: the last
// coloured frame is t=3.950 and t=3.967 is fully desaturated, with no
// retraction of the edge in between [measured]. Duration 0 is the finding, not
// an omission.
export const wipeOut = (options = {}) => ({
  opacity: 0,
  duration: 0,
  ...options,
});
