import { Container, SectionHeading } from '@/components/ui';
import { useProjectCarousel } from '../hooks/useProjectCarousel';
import ProjectShowcaseCard from './ProjectShowcaseCard';

const number = (value) => String(value).padStart(2, '0');

export const ProjectCarousel = ({ projects }) => {
  const { ref, activeIndex, navigate } = useProjectCarousel(projects.length);
  const onKeyDown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest('[data-project-card]')) return;
    const destination = {
      ArrowLeft: activeIndex - 1,
      ArrowRight: activeIndex + 1,
      Home: 0,
      End: projects.length - 1,
    }[event.key];
    if (destination === undefined) return;
    event.preventDefault();
    navigate(destination);
  };

  return (
    <section
      ref={ref}
      id="work"
      aria-labelledby="work-heading"
      className="projects-scroll-zone relative"
      style={{ '--project-steps': Math.max(1, projects.length - 1) }}
    >
      <div className="projects-sticky-screen sticky top-0 overflow-clip">
        <Container variant="base" className="projects-screen-content">
          <header className="projects-header flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs tracking-widest text-ink-subtle uppercase">
                Selected Work / 2026
              </p>
              <SectionHeading
                id="work-heading"
                label={
                  <>
                    Projects that
                    <br />
                    move with you.
                  </>
                }
              />
            </div>
            <div className="shrink-0 text-right text-xs text-ink-muted">
              <p
                className="mb-2 font-mono tabular-nums"
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="sr-only">Project </span>
                {number(activeIndex + 1)} / {number(projects.length)}
              </p>
              <p>Scroll to continue</p>
            </div>
          </header>
          <div
            className="project-stage relative grid min-h-0 min-w-0 items-center [perspective:1400px]"
            role="region"
            aria-label="Selected projects"
            aria-roledescription="carousel"
            aria-describedby="project-interaction-hint"
            tabIndex={0}
            onKeyDown={onKeyDown}
          >
            {projects.map((project, index) => (
              <ProjectShowcaseCard
                key={project.slug}
                project={project}
                index={index}
                active={index === activeIndex}
              />
            ))}
          </div>
          <footer
            className="projects-footer flex items-center justify-between gap-4 border-t border-line pt-3"
            onKeyDown={onKeyDown}
          >
            <div>
              <div className="flex w-36 items-center gap-3 font-mono text-xs text-ink-muted tabular-nums sm:w-48">
                <span>{number(activeIndex + 1)}</span>
                <div aria-hidden="true" className="h-px grow bg-control">
                  <div
                    data-project-progress
                    className="h-full origin-left bg-ink"
                  />
                </div>
                <span>{number(projects.length)}</span>
              </div>
              <p
                id="project-interaction-hint"
                className="mt-2 text-xs text-ink-subtle"
              >
                Scroll to explore. Grab to play.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous project"
                disabled={activeIndex === 0}
                onClick={() => navigate(activeIndex - 1)}
                className="flex size-11 items-center justify-center rounded-full border border-control hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next project"
                disabled={activeIndex === projects.length - 1}
                onClick={() => navigate(activeIndex + 1)}
                className="flex size-11 items-center justify-center rounded-full border border-control hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
              >
                →
              </button>
            </div>
          </footer>
        </Container>
      </div>
    </section>
  );
};
export default ProjectCarousel;
