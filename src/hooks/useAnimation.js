import { useRef, useEffect } from 'react';
import { animate, createScope } from 'animejs';
import { shouldReduceMotion } from '@/animations/utils/animationUtils';

// Anime.js v4 recommends scoping animations to a root element in an effect and
// calling scope.revert() on cleanup, which stops the animation and restores the
// inline styles it wrote.

// The config is captured on first render; animations run once when the
// element mounts. Re-triggering is intentionally out of scope.
export const useAnimation = (animationConfig) => {
  const ref = useRef(null);
  const configRef = useRef(animationConfig);

  useEffect(() => {
    const root = ref.current;
    if (!root || shouldReduceMotion()) {
      return;
    }

    const scope = createScope({ root }).add(() => {
      animate(root, configRef.current);
    });

    return () => scope.revert();
  }, []);

  return ref;
};

export const useAnimationOnHover = (onHoverConfig, onLeaveConfig) => {
  const ref = useRef(null);
  const scopeRef = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || shouldReduceMotion()) {
      return;
    }

    // Registered scope methods stay callable from event handlers, and every
    // animation they start is torn down by the single revert() below.
    scopeRef.current = createScope({ root }).add((self) => {
      self.add('run', (config) => animate(root, config));
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, []);

  return {
    ref,
    onMouseEnter: () => scopeRef.current?.methods.run(onHoverConfig),
    onMouseLeave: () => scopeRef.current?.methods.run(onLeaveConfig),
  };
};
