import { assets } from '../data';
import { usePortraitParticles } from '../hooks/usePortraitParticles';

export const HeroPortrait = () => {
  const { canvasRef, baseRef, ready } = usePortraitParticles(assets.portrait);

  return (
    <div
      data-hero-portrait
      className="relative isolate mx-auto flex w-full max-w-[520px] items-end self-end overflow-hidden pt-6"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-4 bottom-0 -z-10 aspect-square rounded-t-full bg-portrait"
      />

      <div className="relative w-full">
        {/* Sizes the box and is the grayscale fallback (no canvas, reduced
            motion, or sampling failure); hidden once particles take over. */}
        <img
          src={assets.portrait}
          alt={assets.portraitAlt}
          width={880}
          height={800}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={ready ? { opacity: 0 } : undefined}
          className="block h-auto w-full object-contain object-bottom grayscale"
        />
        <canvas
          ref={baseRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full touch-pan-y"
        />
      </div>
    </div>
  );
};

export default HeroPortrait;
