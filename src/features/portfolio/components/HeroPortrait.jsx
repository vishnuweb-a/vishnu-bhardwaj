import { assets } from '../data';

// Background-removed cutout, bottom-anchored, sitting in front of the
// wordmark's baseline with the head crown clearing it by only a few pixels
// (design.md section 9, [measured]).
//
// No portrait file exists yet. The frame still reserves the measured footprint
// so the three-band composition and the entrance timing are already correct;
// naming a file in data/assets.js is the only change needed.
export const HeroPortrait = () => (
  <div
    data-hero-portrait
    className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center"
  >
    {assets.portrait ? (
      <img
        src={assets.portrait}
        alt={assets.portraitAlt}
        width={520}
        height={694}
        // Above the fold and part of the entrance - never lazy.
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="h-[52vh] w-auto max-w-[80vw] object-contain object-bottom grayscale-[0.35] sm:h-[58vh] lg:h-[62vh]"
      />
    ) : (
      <div
        aria-hidden="true"
        className="flex h-[38vh] w-[clamp(200px,26vw,340px)] items-end justify-center rounded-t-[999px] border border-b-0 border-line bg-surface pb-6 sm:h-[44vh] lg:h-[48vh]"
      >
        <span className="text-[0.6875rem] font-medium tracking-[0.14em] text-ink-muted uppercase">
          Portrait pending
        </span>
      </div>
    )}
  </div>
);

export default HeroPortrait;
