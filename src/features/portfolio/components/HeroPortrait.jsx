import { usePointerWipe } from '@/hooks';
import { assets } from '../data';
const PORTRAIT_BOX = 'block h-auto w-full object-contain object-bottom';

export const HeroPortrait = () => {
  const { containerRef, curtainRef, contentRef } = usePointerWipe();

  return (
    <div
      data-hero-portrait
      className="relative isolate mx-auto flex w-full max-w-[520px] items-end self-end overflow-hidden pt-6"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-4 bottom-0 -z-10 aspect-square rounded-t-full bg-portrait"
      />

      <div ref={containerRef} className="pointer-events-auto relative w-full">
        <img
          src={assets.portrait}
          alt={assets.portraitAlt}
          width={880}
          height={800}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className={`${PORTRAIT_BOX} grayscale-[0.35]`}
        />

        <div
          ref={curtainRef}
          aria-hidden="true"
          style={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <img
            ref={contentRef}
            src={assets.portrait}
            alt=""
            width={880}
            height={800}
            loading="eager"
            decoding="async"
            className={PORTRAIT_BOX}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroPortrait;
