import { useEffect, useRef } from 'react';
import { createScope } from 'animejs';
import {
  createAnimation,
  projectBounce,
  projectImpact,
  shouldReduceMotion,
} from '@/animations';

const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));

export const useProjectDrag = (active) => {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!active) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let effect;
    let springing = false;
    const scope = createScope({ root }).add((self) => {
      self.add('play', (preset) => {
        if (shouldReduceMotion() || pointer !== null || springing) return;
        effect?.revert();
        effect = createAnimation(root, preset);
      });
    });
    let pointer = null;
    let frame = 0;
    let x = 0;
    let y = 0;
    let vx = 0;
    let vy = 0;
    let lastTime = 0;
    let originX = 0;
    let originY = 0;
    let previousX = 0;
    let previousY = 0;
    let moved = false;
    let limitX = 180;
    let limitY = 100;

    const paint = () => {
      root.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${clamp(x / 24, 7.5)}deg)`;
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      effect?.revert();
      springing = false;
      const captured = pointer;
      pointer = null;
      if (captured !== null && root.hasPointerCapture(captured))
        root.releasePointerCapture(captured);
      x = y = vx = vy = 0;
      moved = false;
      root.style.transform = '';
      root.removeAttribute('data-dragging');
    };
    const down = (event) => {
      if (
        shouldReduceMotion() ||
        !event.isPrimary ||
        event.button !== 0 ||
        pointer !== null
      )
        return;
      const handle = event.target.closest('[data-drag-handle]');
      if (event.target.closest('a, button') && !handle) return;
      // Keep native touch scrolling everywhere except the explicit grab handle.
      if (event.pointerType !== 'mouse' && !handle) return;
      cancelAnimationFrame(frame);
      frame = 0;
      effect?.revert();
      springing = false;
      pointer = event.pointerId;
      const bounds = root.getBoundingClientRect();
      // On narrow screens retain a small elastic excursion inside the clipped stage.
      limitX = Math.min(
        190,
        Math.max(12, (window.innerWidth - bounds.width) / 2 - 8)
      );
      limitY = Math.min(
        110,
        Math.max(16, (window.innerHeight - bounds.height) / 2 - 24)
      );
      originX = event.clientX - x;
      originY = event.clientY - y;
      previousX = event.clientX;
      previousY = event.clientY;
      lastTime = performance.now();
      vx = vy = 0;
      moved = false;
      root.setPointerCapture(pointer);
      root.setAttribute('data-dragging', 'true');
    };
    const move = (event) => {
      if (event.pointerId !== pointer) return;
      const now = performance.now();
      const elapsed = Math.max(8, now - lastTime);
      vx = clamp(((event.clientX - previousX) / elapsed) * 16.667, 35);
      vy = clamp(((event.clientY - previousY) / elapsed) * 16.667, 28);
      x = clamp(event.clientX - originX, limitX);
      y = clamp(event.clientY - originY, limitY);
      moved ||= Math.abs(x) + Math.abs(y) > 5;
      previousX = event.clientX;
      previousY = event.clientY;
      lastTime = now;
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          paint();
        });
    };
    const release = (event) => {
      if (event.pointerId !== pointer) return;
      const cancelled = event.type !== 'pointerup';
      const captured = pointer;
      pointer = null;
      if (root.hasPointerCapture(captured))
        root.releasePointerCapture(captured);
      root.removeAttribute('data-dragging');
      cancelAnimationFrame(frame);
      if (cancelled || performance.now() - lastTime > 90) vx = vy = 0;
      if (cancelled) moved = false;
      if (shouldReduceMotion()) {
        reset();
        return;
      }
      let previous = performance.now();
      springing = true;
      let accumulator = 0;
      const settle = (now) => {
        // Fixed 120 Hz integration keeps the spring consistent across displays.
        accumulator += Math.min(now - previous, 64);
        previous = now;
        while (accumulator >= 1000 / 120) {
          vx = (vx - x * 0.08 * 0.5) * Math.sqrt(0.82);
          vy = (vy - y * 0.08 * 0.5) * Math.sqrt(0.82);
          x = clamp(x + vx * 0.5, limitX);
          y = clamp(y + vy * 0.5, limitY);
          accumulator -= 1000 / 120;
        }
        paint();
        if (Math.abs(x) + Math.abs(y) + Math.abs(vx) + Math.abs(vy) < 0.12)
          reset();
        else frame = requestAnimationFrame(settle);
      };
      frame = requestAnimationFrame(settle);
    };
    const click = (event) => {
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
        moved = false;
      } else if (
        event.target.closest('[data-drag-handle]') &&
        event.detail === 0
      ) {
        scope.methods.play(projectBounce());
      }
    };
    const hover = (event) => {
      if (event.pointerType === 'mouse') scope.methods.play(projectBounce());
    };
    const impact = () => scope.methods.play(projectImpact());
    const keydown = (event) => {
      if (event.key === 'Escape') reset();
    };
    root.addEventListener('pointerdown', down);
    root.addEventListener('pointerenter', hover);
    root.addEventListener('projectsettle', impact);
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerup', release);
    root.addEventListener('pointercancel', release);
    root.addEventListener('lostpointercapture', release);
    root.addEventListener('click', click, true);
    root.addEventListener('keydown', keydown);
    media.addEventListener('change', reset);
    window.addEventListener('blur', reset);
    return () => {
      reset();
      scope.revert();
      root.removeEventListener('pointerdown', down);
      root.removeEventListener('pointerenter', hover);
      root.removeEventListener('projectsettle', impact);
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerup', release);
      root.removeEventListener('pointercancel', release);
      root.removeEventListener('lostpointercapture', release);
      root.removeEventListener('click', click, true);
      root.removeEventListener('keydown', keydown);
      media.removeEventListener('change', reset);
      window.removeEventListener('blur', reset);
    };
  }, [active]);

  return ref;
};
