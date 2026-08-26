import { animate } from 'animejs';

export const shouldReduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Returns null when motion is reduced. Elements are authored in their final
// visual state, so skipping the animation leaves a usable, static page.
export const createAnimation = (targets, animationConfig) => {
  if (shouldReduceMotion()) {
    return null;
  }
  return animate(targets, animationConfig);
};
