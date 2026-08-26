import { stagger } from 'animejs';

export const staggerIn = (options = {}) => ({
  opacity: [0, 1],
  translateY: [20, 0],
  duration: 600,
  delay: stagger(80),
  ease: 'outQuad',
  ...options,
});

export const staggerScale = (options = {}) => ({
  scale: [0.9, 1],
  opacity: [0, 1],
  duration: 500,
  delay: stagger(60),
  ease: 'outBack',
  ...options,
});

// The measured section reveal: service rows begin at t=8.57 / 8.70 / 8.83 in
// the reference, a 130ms stagger over an ~800ms rise (design.md section 18).
// `each` lets the projects grid pass its slightly wider 150-200ms stagger
// without duplicating the preset.
export const staggerReveal = ({ each = 130, ...options } = {}) => ({
  translateY: [48, 0],
  opacity: [0, 1],
  duration: 800,
  delay: stagger(each),
  ease: 'outExpo',
  ...options,
});
