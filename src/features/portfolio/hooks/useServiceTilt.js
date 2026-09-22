import { useEffect, useRef } from 'react';
import { createAnimatable, createScope } from 'animejs';
import { serviceTilt, shouldReduceMotion } from '@/animations';

// Follow the existing usePointerFollow pattern: reuse one animatable instead
// of allocating animations or rendering React on every pointer event.
export const useServiceTilt = () => {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let cleanup = () => {};

    const setup = () => {
      cleanup();
      cleanup = () => {};
      if (shouldReduceMotion() || !pointer.matches) return;

      let tilt;
      let frame = 0;
      let point;
      const surface = root.querySelector('[data-service-surface]');
      const scope = createScope({ root }).add(() => {
        tilt = createAnimatable(surface, serviceTilt());
      });
      const move = (event) => {
        if (event.pointerType !== 'mouse') return;
        point = { x: event.clientX, y: event.clientY };
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          // The stable wrapper prevents rotation feeding back into pointer
          // coordinates. Read once per frame, before any animation writes.
          const bounds = root.getBoundingClientRect();
          const x = Math.max(
            -0.5,
            Math.min(0.5, (point.x - bounds.left) / bounds.width - 0.5)
          );
          const y = Math.max(
            -0.5,
            Math.min(0.5, (point.y - bounds.top) / bounds.height - 0.5)
          );
          tilt.rotateX(-y * 4, 200);
          tilt.rotateY(x * 5, 200);
          tilt.translateY(-2, 200);
        });
      };
      const reset = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        tilt.rotateX(0, 400);
        tilt.rotateY(0, 400);
        tilt.translateY(0, 400);
      };
      root.addEventListener('pointermove', move);
      root.addEventListener('pointerleave', reset);
      root.addEventListener('pointercancel', reset);
      window.addEventListener('blur', reset);
      cleanup = () => {
        cancelAnimationFrame(frame);
        root.removeEventListener('pointermove', move);
        root.removeEventListener('pointerleave', reset);
        root.removeEventListener('pointercancel', reset);
        window.removeEventListener('blur', reset);
        scope.revert();
      };
    };
    setup();
    motion.addEventListener('change', setup);
    pointer.addEventListener('change', setup);
    return () => {
      cleanup();
      motion.removeEventListener('change', setup);
      pointer.removeEventListener('change', setup);
    };
  }, []);

  return ref;
};

export default useServiceTilt;
