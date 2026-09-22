import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { shouldReduceMotion } from '@/animations';
import { byteBubbleIn } from '@/animations/presets/byte';

/**
 * The speech bubble.
 *
 * Positioned above the pet and horizontally centred, with `left-1/2` plus a
 * translate rather than a fixed offset, so it stays attached whichever way
 * BYTE is facing. `max-w` and `whitespace-nowrap` together are what keep a
 * line from wrapping into a paragraph - the copy is written short enough that
 * it never needs to (see data/speech.js).
 *
 * It is `pointer-events-none`: the bubble is output, never a target, and
 * letting it swallow a click would put a dead zone above BYTE's head.
 *
 * The text is announced politely rather than silently: a visitor using a
 * screen reader gets BYTE's comments if they are already on the page, but the
 * live region never interrupts and never steals focus.
 */
export const ByteSpeechBubble = ({ text }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!text || !ref.current || shouldReduceMotion()) return;
    animate(ref.current, byteBubbleIn());
  }, [text]);

  if (!text) return null;

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute bottom-full left-1/2 mb-1 max-w-[42vw] -translate-x-1/2 rounded-lg border border-line bg-surface-raised px-2.5 py-1 text-center text-[0.6875rem] leading-tight font-medium whitespace-nowrap text-ink shadow-pill"
    >
      {text}
    </div>
  );
};

export default ByteSpeechBubble;
