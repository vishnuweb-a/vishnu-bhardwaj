import { useSearchParams } from 'react-router-dom';
import { Container, Pill, SectionHeading } from '@/components/ui';
import { ArrowUpRight } from '@/components/ui/icons';
import { useScrollReveal } from '@/hooks';
import { revealOnScroll, staggerReveal } from '@/animations';
import { PROJECT_CATEGORIES, filterProjects, socials } from '../data';
import ProjectFilters from './ProjectFilters';
import ProjectCard from './ProjectCard';

// /SELECTED WORK over a PORTFOLIO ghost watermark, a control row, then a
// two-column grid in the 1104px NARROW container with a 56px gap
// ([measured], design.md section 11). It is a grid - not a carousel, not
// horizontal scroll, not a stack.
//
// Card stagger is ~150-200ms against the 130ms used elsewhere, which is what
// the video shows for this section specifically.
const workArchive = socials.find((social) => social.id === 'github');

export const ProjectsSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('filter');
  const active = PROJECT_CATEGORIES.includes(requested) ? requested : 'All';
  const visible = filterProjects(active);

  const headingRef = useScrollReveal(revealOnScroll());
  const gridRef = useScrollReveal(staggerReveal({ each: 170 }), {
    selector: '[data-reveal-card]',
  });

  const handleFilterChange = (category) => {
    const next = new URLSearchParams(searchParams);
    if (category === 'All') {
      next.delete('filter');
    } else {
      next.set('filter', category);
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="py-24 lg:py-32"
    >
      <Container variant="wide">
        <div ref={headingRef}>
          <SectionHeading
            id="work-heading"
            label="/Selected Work"
            watermark="Portfolio"
            align="center"
            className="pt-10"
          />
        </div>
      </Container>

      <Container variant="narrow" className="mt-16 lg:mt-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <ProjectFilters active={active} onChange={handleFilterChange} />

          {/* The reference carries a `View All Work` pill but never shows its
              destination, so plan.md defers inventing an index route. It points
              at the owner's public repositories, which is the real full body of
              work rather than a fabricated page. */}
          <Pill
            as="a"
            href={workArchive.href}
            target="_blank"
            rel="noreferrer noopener"
            tone="raised"
            size="md"
            className="self-start hover:border-ink sm:self-auto"
          >
            View All Work
            <ArrowUpRight size={15} />
          </Pill>
        </div>

        {visible.length > 0 ? (
          <ul
            ref={gridRef}
            className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-14 lg:gap-14"
          >
            {visible.map((project) => (
              <li key={project.slug} data-reveal-card>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-14 rounded-xl border border-line bg-surface px-6 py-16 text-center text-ink-muted">
            No projects in this category yet.
          </p>
        )}
      </Container>
    </section>
  );
};

export default ProjectsSection;
