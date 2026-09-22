import { useEffect, useRef } from 'react';
import { createScope } from 'animejs';
import {
  createAnimation,
  revealOnScroll,
  serviceMarquee,
  serviceRing,
  shouldReduceMotion,
} from '@/animations';

export const useServicesMotion = (paused) => {
  const ref = useRef(null);
  const playback = useRef({ paused, sync: () => {} });

  useEffect(() => {
    playback.current.paused = paused;
    playback.current.sync();
  }, [paused]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const revealed = new Set();
    let cleanup = () => {};

    const setup = () => {
      cleanup();
      cleanup = () => {};
      if (shouldReduceMotion()) {
        root
          .querySelectorAll('[data-service-reveal]')
          .forEach((node) => revealed.add(node));
        return;
      }

      let loops = [];
      let visible = false;
      const scope = createScope({ root }).add((self) => {
        loops = [
          createAnimation(
            root.querySelector('[data-build-ring]'),
            serviceRing({ autoplay: false })
          ),
          createAnimation(
            root.querySelector('[data-service-ticker]'),
            serviceMarquee({ autoplay: false })
          ),
        ].filter(Boolean);
        self.add('reveal', (node) => {
          createAnimation(
            node,
            revealOnScroll({
              translateY: [20, 0],
              duration: 600,
              delay: Number(node.dataset.serviceReveal || 0),
            })
          );
        });
      });
      const sync = () => {
        loops.forEach((animation) => {
          if (visible && !playback.current.paused && !document.hidden)
            animation.resume();
          else animation.pause();
        });
      };
      playback.current.sync = sync;
      const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
      visibility.observe(root);
      const entrance = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ target, isIntersecting }) => {
            if (!isIntersecting) return;
            entrance.unobserve(target);
            if (revealed.has(target) || shouldReduceMotion()) return;
            revealed.add(target);
            scope.methods.reveal(target);
          });
        },
        { threshold: 0.08 }
      );
      root
        .querySelectorAll('[data-service-reveal]')
        .forEach((node) => entrance.observe(node));
      document.addEventListener('visibilitychange', sync);
      cleanup = () => {
        visibility.disconnect();
        entrance.disconnect();
        document.removeEventListener('visibilitychange', sync);
        playback.current.sync = () => {};
        scope.revert();
      };
    };
    setup();
    preference.addEventListener('change', setup);
    return () => {
      cleanup();
      preference.removeEventListener('change', setup);
    };
  }, []);

  return ref;
};

export default useServicesMotion;
