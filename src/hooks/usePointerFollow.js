import { useRef, useEffect, useState } from 'react';
import { animate, createAnimatable, createScope } from 'animejs';
import { shouldReduceMotion } from '@/animations/utils/animationUtils';
import {
  pointerFollow,
  followerIn,
  followerOut,
} from '@/animations/presets/pointerFollow';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';

// Drives the two pointer-following elements the reference treats as its
// signature interaction (design.md sections 11, 12): a decorative follower that
// tracks the cursor inside a container with a visible trailing lag.
//
// The lag comes from createAnimatable, whose per-property duration and ease
// interpolate towards each new target rather than snapping to it. Writing
// transform straight from the pointer position would remove exactly the quality
// that makes the interaction read as premium.
//
// Gated twice over: disabled entirely under reduced motion, and disabled on
// coarse pointers where there is no cursor to follow. Both followers are
// decorative - the underlying action is always reachable without them.
export const usePointerFollow = ({
  offsetX = 0,
  offsetY = 0,
  settings = pointerFollow(),
  enter = followerIn(),
  leave = followerOut(),
} = {}) => {
  const containerRef = useRef(null);
  const followerRef = useRef(null);
  const [active, setActive] = useState(false);

  // Captured on first render, matching the contract of the existing
  // useAnimation hook: the config is fixed for the life of the element.
  const configRef = useRef({ offsetX, offsetY, settings, enter, leave });

  useEffect(() => {
    const container = containerRef.current;
    const follower = followerRef.current;

    if (!container || !follower || shouldReduceMotion()) {
      return undefined;
    }
    if (!window.matchMedia(FINE_POINTER).matches) {
      return undefined;
    }

    const config = configRef.current;
    setActive(true);

    let animatable = null;
    // Cached on pointerenter so pointermove never reads layout (test.md 8).
    let bounds = null;
    let halfWidth = 0;
    let halfHeight = 0;

    // createAnimatable accepts a property's duration either as a bare number or
    // inside an options object; both forms are read back the same way here.
    const durationOf = (value) =>
      typeof value === 'number' ? value : (value?.duration ?? 0);
    const durationX = durationOf(config.settings.x);
    const durationY = durationOf(config.settings.y);

    // Registering the fade as a scope method keeps every animation this hook
    // starts inside one scope, so the single revert() below tears all of it
    // down and restores the inline styles it wrote.
    const scope = createScope({ root: container }).add((self) => {
      animatable = createAnimatable(follower, config.settings);
      self.add('fade', (params) => animate(follower, params));
    });

    const positionFor = (event) => ({
      x: event.clientX - bounds.left - halfWidth + config.offsetX,
      y: event.clientY - bounds.top - halfHeight + config.offsetY,
    });

    const handleEnter = (event) => {
      bounds = container.getBoundingClientRect();
      halfWidth = follower.offsetWidth / 2;
      halfHeight = follower.offsetHeight / 2;

      // Jump to the entry point with duration 0 so the follower fades in where
      // the cursor already is instead of flying in from the container origin.
      const { x, y } = positionFor(event);
      animatable?.x(x, 0);
      animatable?.y(y, 0);
      scope.methods.fade(config.enter);
    };

    const handleMove = (event) => {
      if (!bounds) {
        return;
      }
      const { x, y } = positionFor(event);
      // The duration is passed on every move, not just the first. A setter call
      // with an explicit duration calls stretch() on the underlying animation,
      // and that stretch is permanent - so the duration-0 placement in
      // handleEnter would otherwise leave the follower snapping instantly to
      // the cursor for the rest of the hover, with no damping at all. stretch()
      // early-returns once the duration already matches, so restating it here
      // costs a comparison and restores the trail after every re-entry.
      animatable?.x(x, durationX);
      animatable?.y(y, durationY);
    };

    const handleLeave = () => {
      bounds = null;
      scope.methods.fade(config.leave);
    };

    container.addEventListener('pointerenter', handleEnter);
    container.addEventListener('pointermove', handleMove);
    container.addEventListener('pointerleave', handleLeave);

    return () => {
      container.removeEventListener('pointerenter', handleEnter);
      container.removeEventListener('pointermove', handleMove);
      container.removeEventListener('pointerleave', handleLeave);
      scope.revert();
    };
  }, []);

  return { containerRef, followerRef, active };
};

export default usePointerFollow;
