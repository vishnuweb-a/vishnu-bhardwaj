import { Container, SectionHeading } from '@/components/ui';
import { useScrollReveal } from '@/hooks';
import { revealOnScroll } from '@/animations';
import { experience, profile } from '../data';
import ExperienceRow from './ExperienceRow';

export const ExperienceSection = () => {
  const headingRef = useScrollReveal(
    revealOnScroll({ translateY: [12, 0], duration: 400 })
  );
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="py-16 lg:py-20"
    >
      <Container variant="base">
        <div
          ref={headingRef}
          className="flex flex-wrap items-end justify-between gap-3"
        >
          <SectionHeading id="experience-heading" label="/Experience" />
          <p className="text-sm text-ink-muted">{profile.experienceSummary}</p>
        </div>
        <ul className="mt-10 border-t border-line">
          {experience.map((entry) => (
            <ExperienceRow key={entry.id} entry={entry} />
          ))}
        </ul>
      </Container>
    </section>
  );
};
export default ExperienceSection;
