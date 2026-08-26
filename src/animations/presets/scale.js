export const scaleIn = (options = {}) => ({
  scale: [0.9, 1],
  opacity: [0, 1],
  duration: 600,
  ease: 'outBack',
  ...options,
});

export const scaleOut = (options = {}) => ({
  scale: [1, 0.9],
  opacity: [1, 0],
  duration: 600,
  ease: 'inBack',
  ...options,
});
