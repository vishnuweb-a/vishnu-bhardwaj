export const projectPerspective = (options = {}) => ({
  translateX: [
    { from: 130, to: 0, duration: 500 },
    { to: -130, duration: 500 },
  ],
  translateZ: [
    { from: -150, to: 0, duration: 500 },
    { to: -150, duration: 500 },
  ],
  rotateY: [
    { from: -38, to: 0, duration: 500 },
    { to: 38, duration: 500 },
  ],
  rotateZ: [
    { from: 4, to: 0, duration: 500 },
    { to: -4, duration: 500 },
  ],
  scale: [
    { from: 0.94, to: 1, duration: 500 },
    { to: 0.94, duration: 500 },
  ],
  translateY: [
    { from: 12, to: 0, duration: 500 },
    { to: 12, duration: 500 },
  ],
  opacity: [
    { from: 0, to: 1, duration: 500 },
    { to: 0, duration: 500 },
  ],
  duration: 1000,
  ease: 'linear',
  autoplay: false,
  ...options,
});

export const projectImpact = (options = {}) => ({
  translateX: [
    { to: 4, duration: 55 },
    { to: -2, duration: 75 },
    { to: 1, duration: 85 },
    { to: 0, duration: 135 },
  ],
  translateY: [
    { to: 1.5, duration: 80 },
    { to: -0.5, duration: 100 },
    { to: 0, duration: 170 },
  ],
  rotate: [
    { to: 0.4, duration: 80 },
    { to: -0.2, duration: 100 },
    { to: 0, duration: 170 },
  ],
  ease: 'outQuad',
  ...options,
});

export const projectBounce = (options = {}) => ({
  translateY: [
    { to: -10, duration: 180, ease: 'outQuad' },
    { to: 3, duration: 150, ease: 'inOutSine' },
    { to: -2, duration: 110, ease: 'inOutSine' },
    { to: 0, duration: 110, ease: 'outQuad' },
  ],
  ...options,
});
