export const slideUp = (options = {}) => ({
  translateY: [40, 0],
  opacity: [0, 1],
  duration: 800,
  ease: 'outQuad',
  ...options,
});

export const slideDown = (options = {}) => ({
  translateY: [-40, 0],
  opacity: [0, 1],
  duration: 800,
  ease: 'outQuad',
  ...options,
});

export const slideLeft = (options = {}) => ({
  translateX: [40, 0],
  opacity: [0, 1],
  duration: 800,
  ease: 'outQuad',
  ...options,
});

export const slideRight = (options = {}) => ({
  translateX: [-40, 0],
  opacity: [0, 1],
  duration: 800,
  ease: 'outQuad',
  ...options,
});
