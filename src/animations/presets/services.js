export const serviceTilt = (options = {}) => ({
  rotateX: { duration: 200 },
  rotateY: { duration: 200 },
  translateY: { duration: 200 },
  ease: 'outQuad',
  ...options,
});

export const serviceRing = (options = {}) => ({
  rotate: [0, 360],
  duration: 14000,
  loop: true,
  ease: 'linear',
  ...options,
});

export const serviceMarquee = (options = {}) => ({
  translateX: ['0%', '-50%'],
  duration: 28000,
  loop: true,
  ease: 'linear',
  ...options,
});

// The "Building now" indicator. Authored at full opacity so the reduced-motion
// path leaves a solid, legible dot rather than a half-faded one.
export const statusPulse = (options = {}) => ({
  opacity: [1, 0.35],
  duration: 1400,
  loop: true,
  alternate: true,
  ease: 'inOutQuad',
  ...options,
});
