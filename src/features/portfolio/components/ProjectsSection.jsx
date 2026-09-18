import { useSearchParams } from 'react-router-dom';
import { Container, Pill, SectionHeading } from '@/components/ui';
import { ArrowUpRight } from '@/components/ui/icons';
import { useScrollReveal } from '@/hooks';
import { revealOnScroll } from '@/animations';
import { PROJECT_CATEGORIES, filterProjects, projects, socials } from '../data';
import ProjectFilters from './ProjectFilters';
import ProjectCard from './ProjectCard';

const workArchive = socials.find((social) => social.id === 'github');
// Highlight existing screenshot-rich records without changing their source order.
const featuredSlugs = projects
  .filter((project) => project.thumbnail)
  .slice(0, 2)
  .map((project) => project.slug);

export const ProjectsSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('filter');
  const active = PROJECT_CATEGORIES.includes(requested) ? requested : 'All';
  const visible = filterProjects(active);
  const featured = visible.filter((project) =>
    featuredSlugs.includes(project.slug)
  );
  const archive = visible.filter(
    (project) => !featuredSlugs.includes(project.slug)
  );
  const headingRef = useScrollReveal(
    revealOnScroll({ translateY: [12, 0], duration: 400 })
  );

  const handleFilterChange = (category) => {
    const next = new URLSearchParams(searchParams);
    if (category === 'All') next.delete('filter');
    else next.set('filter', category);
    setSearchParams(next, { replace: true });
  };

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="py-16 lg:py-20"
    >
      <Container variant="base">
        <div
          ref={headingRef}
          className="flex flex-wrap items-end justify-between gap-5"
        >
          <SectionHeading id="work-heading" label="/Selected Work" />
          <Pill
            as="a"
            href={workArchive.href}
            target="_blank"
            rel="noreferrer noopener"
            tone="raised"
            size="md"
            className="hover:border-ink"
          >
            View All Work <ArrowUpRight size={15} />
          </Pill>
        </div>
        <div className="mt-6 border-b border-line">
          <ProjectFilters active={active} onChange={handleFilterChange} />
        </div>
        {visible.length > 0 ? (
          <div className="mt-8" aria-live="polite" aria-atomic="false">
            {featured.length > 0 ? (
              <ul className="grid gap-8">
                {featured.map((project, index) => (
                  <li key={project.slug}>
                    <ProjectCard
                      project={project}
                      featured
                      reverse={index % 2 === 1}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
            <ul
              className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${featured.length ? 'mt-8' : ''}`}
            >
              {archive
                .filter((project) => project.thumbnail)
                .map((project) => (
                  <li key={project.slug}>
                    <ProjectCard project={project} />
                  </li>
                ))}
            </ul>
            <ul className="mt-8 border-t border-line">
              {archive
                .filter((project) => !project.thumbnail)
                .map((project) => (
                  <li key={project.slug}>
                    <ProjectCard project={project} />
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <p className="mt-14 rounded-lg border border-line bg-surface px-6 py-16 text-center text-ink-muted">
            No projects in this category yet.
          </p>
        )}
      </Container>
    </section>
  );
};
export default ProjectsSection;
