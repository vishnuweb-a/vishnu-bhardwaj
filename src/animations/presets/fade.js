export const fadeIn = (options = {}) => ({
  opacity: [0, 1],
  duration: 800,
  ease: 'outQuad',
  ...options,
});

export const fadeOut = (options = {}) => ({
  opacity: [1, 0],
  duration: 600,
  ease: 'outQuad',
  ...options,
});
