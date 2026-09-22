import { useEffect, useRef, useState } from 'react';

export const useExperienceTimeline = () => {
  const ref = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const cards = Array.from(
      ref.current?.querySelectorAll('[data-experience-card]') ?? []
    );
    if (!cards.length || !('IntersectionObserver' in window)) return undefined;

    let current = 0;
    const observer = new IntersectionObserver(
      () => {
        // Callback entries contain only threshold crossings. Measure the whole
        // group so two visible cards are compared using the same viewport.
        const viewportBottom = window.innerHeight;
        const viewportTop = Math.min(96, viewportBottom / 4);
        const scores = cards.map((card) => {
          const { top, bottom, height } = card.getBoundingClientRect();
          const visible = Math.max(
            0,
            Math.min(bottom, viewportBottom) - Math.max(top, viewportTop)
          );
          // Tall cards must remain eligible on short screens and at zoom.
          return visible / Math.min(height, viewportBottom - viewportTop);
        });
        const best = scores.indexOf(Math.max(...scores));
        // Hysteresis prevents flicker when adjacent cards share the viewport.
        if (scores[best] > 0 && scores[best] > scores[current] + 0.08) {
          current = best;
          setActiveIndex(best);
        }
      },
      {
        threshold: [
          0, 0.1, 0.2, 0.3, 0.4, 0.45, 0.5, 0.55, 0.6, 0.7, 0.8, 0.9, 1,
        ],
      }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return { ref, activeIndex };
};

export default useExperienceTimeline;
