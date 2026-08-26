import { useState } from 'react';
import { Container, MediaFrame } from '@/components/ui';
import { usePointerFollow, useScrollReveal } from '@/hooks';
import { revealOnScroll, staggerReveal, pointerFollowSoft } from '@/animations';
import { experience, profile } from '../data';
import ExperienceRow from './ExperienceRow';

// The one inverted section: a --color-panel card at full width minus a 16px
// page margin, ~10px radius, roughly a viewport tall (design.md section 12).
//
// The signature interaction: hovering a row reveals a small work-sample
// thumbnail rotated about -10 degrees that follows the cursor with a visible
// lag, measured across video t=13.45-14.9. One follower is shared by every row
// and swaps its image on pointer-enter, which is both what the reference shows
// and far cheaper than one animatable per row.
export const ExperienceSection = () => {
  const [previewIndex, setPreviewIndex] = useState(0);

  const headingRef = useScrollReveal(revealOnScroll());
  const rowsRef = useScrollReveal(staggerReveal({ each: 130 }), {
    selector: '[data-reveal-row]',
  });

  const { containerRef, followerRef } = usePointerFollow({
    // The thumbnail sits to the right of and above the pointer, as measured.
    offsetX: 96,
    offsetY: -24,
    settings: pointerFollowSoft(),
  });

  const preview = experience[previewIndex] ?? experience[0];

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="py-12 lg:py-20"
    >
      <Container variant="panel">
        <div
          ref={containerRef}
          className="relative isolate overflow-hidden rounded-[10px] bg-panel px-6 py-20 sm:px-10 lg:min-h-[100dvh] lg:px-[110px] lg:py-28"
        >
          <div ref={headingRef} className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[0.5em] left-0 font-display text-watermark leading-none font-light tracking-[0.08em] whitespace-nowrap text-panel-ghost uppercase select-none"
            >
              Experience
            </span>
            <div className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
              <h2
                id="experience-heading"
                className="font-display text-display-md leading-[0.95] font-normal tracking-[0.02em] text-on-panel uppercase"
              >
                /Experience
              </h2>
              <p className="text-base text-on-panel-muted">
                {profile.experienceSummary}
              </p>
            </div>
          </div>

          <ul ref={rowsRef} className="mt-16 lg:mt-24">
            {experience.map((entry, index) => (
              <ExperienceRow
                key={entry.id}
                entry={entry}
                onPointerEnter={() => setPreviewIndex(index)}
              />
            ))}
          </ul>

          {/* Decorative pointer follower. Pointer-only and reduced-motion
              gated by usePointerFollow; every row's content is fully readable
              without it. */}
          <div
            ref={followerRef}
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="pointer-events-none absolute top-0 left-0 z-20 w-[168px] rotate-[-10deg] rounded-lg bg-surface-raised p-1.5 shadow-float"
          >
            <MediaFrame
              src={preview?.media}
              alt=""
              label={preview?.organisation}
              ratio="wide"
              width={168}
              height={95}
              rounded="rounded"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ExperienceSection;
