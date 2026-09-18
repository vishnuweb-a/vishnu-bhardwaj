import { Container, SectionHeading } from '@/components/ui';
import { useScrollReveal } from '@/hooks';
import { revealOnScroll } from '@/animations';
import { experience, profile, projects, services } from '../data';

// The About section the new reference calls for, built as an editorial
// two-column statement rather than the reference's four little icon cards -
// those are the "tiny random icon cards" the brief rules out, and they would
// have needed four invented character traits to fill.
//
// Everything rendered here is either a string from profile.js or a count
// derived from the data arrays, so the section cannot drift out of date and
// nothing in it is a claim the repository cannot support.
const FIGURES = [
  { id: 'projects', value: projects.length, label: 'Projects on record' },
  { id: 'roles', value: experience.length, label: 'Roles and engagements' },
  { id: 'services', value: services.length, label: 'Areas of work' },
];

export const AboutSection = () => {
  const revealRef = useScrollReveal(
    revealOnScroll({ translateY: [12, 0], duration: 400 })
  );

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-line py-16 lg:py-20"
    >
      <Container variant="base">
        <div ref={revealRef}>
          <SectionHeading id="about-heading" label="/About" />

          {/* The lead is the anchor, so it sits on the baseline the notes
              start from rather than floating above a column of empty space. */}
          <div className="mt-8 grid items-end gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
            <p className="max-w-[34ch] text-2xl leading-snug font-semibold tracking-tight text-ink sm:text-3xl">
              {profile.about.lead}
            </p>

            <div>
              {profile.about.notes.map((note) => (
                <p
                  key={note}
                  className="mt-4 max-w-[58ch] text-sm leading-relaxed text-ink-muted first:mt-0"
                >
                  {note}
                </p>
              ))}

              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
                {FIGURES.map((figure) => (
                  <div key={figure.id}>
                    <dt className="sr-only">{figure.label}</dt>
                    <dd>
                      <span className="block font-display text-3xl leading-none font-medium tabular-nums text-ink">
                        {figure.value}
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-2 block text-xs leading-snug text-ink-muted"
                      >
                        {figure.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;
