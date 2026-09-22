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
