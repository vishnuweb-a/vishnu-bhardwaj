import { Container } from '@/components/ui';
import { useAnimation, useScrollReveal } from '@/hooks';
import { revealOnScroll, statusPulse } from '@/animations';
import { experience } from '../data';
import { useExperienceTimeline } from '../hooks/useExperienceTimeline';
import ExperienceCard from './ExperienceCard';
import ExperienceTimeline from './ExperienceTimeline';

export const ExperienceSection = () => {
  const headingRef = useScrollReveal(
    revealOnScroll({ translateY: [12, 0], duration: 400 })
  );
  const statusRef = useAnimation(statusPulse());
  const { ref: cardsRef, activeIndex } = useExperienceTimeline();

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="py-16 lg:py-20"
    >
      <Container variant="base">
        <div
          ref={headingRef}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] leading-relaxed tracking-widest text-ink-muted uppercase">
              Experience / Leadership / Open Source
            </p>
            <h2
              id="experience-heading"
              className="mt-5 font-display text-display-lg leading-tight text-ink"
            >
              Not just titles.
              <br />
              Work I’ve actually done.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-ink-muted sm:text-base">
              Engineering roles, technical leadership, developer communities and
              open-source work — focused on building, shipping and helping teams
              execute.
            </p>
          </div>
          <p className="hidden items-center gap-2.5 pb-2 font-mono text-xs text-ink-muted lg:flex">
            <span
              ref={statusRef}
              aria-hidden="true"
              className="size-1.5 rounded-full bg-ink"
            />
            Building now
          </p>
        </div>
        <div className="mt-12 grid items-start gap-8 lg:mt-16 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-12">
          <ExperienceTimeline entries={experience} activeIndex={activeIndex} />
          <div ref={cardsRef} className="grid min-w-0 gap-5 sm:gap-6">
            {experience.map((entry, index) => (
              <ExperienceCard key={entry.id} entry={entry} index={index} />
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-5 border-t border-line pt-8 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-12">
          <p className="font-mono text-xs tracking-wider text-ink-muted uppercase">
            How I work
          </p>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <p className="max-w-xl text-sm leading-7 text-ink-muted">
              I’m most useful where engineering, ownership and execution overlap
              — understanding the problem, building the system and pushing it
              toward a finished product.
            </p>
            <p className="font-mono text-[10px] leading-6 tracking-wider text-ink-muted">
              LEAD → BUILD → SHIP → CONTRIBUTE
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ExperienceSection;
