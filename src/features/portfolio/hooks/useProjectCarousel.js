import { useEffect, useRef, useState } from 'react';
import { createScope, onScroll } from 'animejs';
import {
  createAnimation,
  projectPerspective,
  shouldReduceMotion,
} from '@/animations';

export const useProjectCarousel = (count) => {
  const ref = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const root = ref.current;
    const screen = root.querySelector('.projects-sticky-screen');
    const cards = [...root.querySelectorAll('[data-project-card]')];
    const visuals = cards.map((card) =>
      card.querySelector('[data-project-visual]')
    );
    const progressBar = root.querySelector('[data-project-progress]');
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let animations = [];
    let scope;
    let locked = 0;

    const update = () => {
      frame = 0;
      const available = root.offsetHeight - screen.offsetHeight;
      const progress = Math.max(
        0,
        Math.min(1, -root.getBoundingClientRect().top / Math.max(1, available))
      );
      const raw = progress * Math.max(0, count - 1);
      const nearest = Math.round(raw);
      const reduced = shouldReduceMotion();
      cards.forEach((card, index) => {
        const delta = index - raw;
        // A small dwell around each stop makes the centered card readable and grabbable.
        const position =
          Math.sign(delta) *
          Math.min(1, Math.max(0, (Math.abs(delta) - 0.18) / 0.82));
        animations[index]?.seek((1 - position) * 500);
        if (reduced) {
          visuals[index].style.transform = '';
          visuals[index].style.opacity = index === nearest ? '1' : '0';
        }
        card.style.zIndex = index === nearest ? '2' : '1';
        if (index !== nearest && card.contains(document.activeElement)) {
          root.querySelector('.project-stage').focus({ preventScroll: true });
        }
        card.inert = index !== nearest;
      });
      progressBar.style.transform = `scaleX(${(raw + 1) / count})`;
      setActiveIndex(nearest);
      if (Math.abs(raw - nearest) <= 0.18 && locked !== nearest) {
        locked = nearest;
        if (!reduced)
          cards[nearest]
            .querySelector('.project-physics')
            .dispatchEvent(new Event('projectsettle'));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const configure = () => {
      scope?.revert();
      animations = [];
      if (!shouldReduceMotion()) {
        scope = createScope({ root }).add(() => {
          animations = visuals.map((visual) =>
            createAnimation(visual, projectPerspective())
          );
        });
      }
      schedule();
    };
    configure();
    const observer = onScroll({
      target: root,
      // Observe beyond the pinned interval too: mobile svh can be shorter than
      // the live viewport after browser chrome collapses.
      enter: 'end start',
      leave: 'start end',
      onUpdate: schedule,
      onEnter: schedule,
      onLeave: schedule,
    });
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    resize.observe(screen);
    media.addEventListener('change', configure);
    return () => {
      cancelAnimationFrame(frame);
      observer.revert();
      resize.disconnect();
      media.removeEventListener('change', configure);
      scope?.revert();
    };
  }, [count]);

  const navigate = (index) => {
    const root = ref.current;
    const screen = root.querySelector('.projects-sticky-screen');
    const target = Math.max(0, Math.min(count - 1, index));
    const top = window.scrollY + root.getBoundingClientRect().top;
    window.scrollTo({
      top:
        top +
        (root.offsetHeight - screen.offsetHeight) *
          (target / Math.max(1, count - 1)),
      behavior: shouldReduceMotion() ? 'instant' : 'smooth',
    });
  };

  return { ref, activeIndex, navigate };
};
