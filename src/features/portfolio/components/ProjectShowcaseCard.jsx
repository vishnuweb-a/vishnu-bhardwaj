import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@/components/ui/icons';
import { useProjectDrag } from '../hooks/useProjectDrag';

export const ProjectShowcaseCard = ({ project, index, active }) => {
  const physicsRef = useProjectDrag(active);
  const repository =
    project.githubUrl ||
    (project.liveUrl?.startsWith('https://github.com/')
      ? project.liveUrl
      : null);
  const website = project.liveUrl?.startsWith('https://github.com/')
    ? null
    : project.liveUrl;
  const hasDetail = project.description;

  return (
    <article
      data-project-card
      aria-label={`${index + 1}. ${project.name}`}
      aria-roledescription="slide"
      aria-hidden={!active}
      inert={!active}
      className={`project-card col-start-1 row-start-1 min-h-0 min-w-0 ${active ? 'z-10' : 'pointer-events-none'}`}
    >
      <div
        ref={physicsRef}
        className="project-physics h-full touch-pan-y cursor-grab data-[dragging]:cursor-grabbing data-[dragging]:select-none motion-reduce:cursor-auto"
      >
        <div
          data-project-visual
          className="project-visual h-full [transform-style:preserve-3d]"
        >
          <div
            className={`project-content flex h-full flex-col overflow-y-auto rounded-lg border bg-surface-raised p-5 sm:p-8 ${active ? 'border-control' : 'border-line'}`}
          >
            <div className="flex items-start justify-between gap-3 border-b border-line pb-3 text-xs text-ink-muted">
              <span className="font-mono tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="mr-auto max-w-64 text-xs tracking-wide uppercase">
                {project.showcaseCategory || project.category}
              </span>
              {project.year ? <span>{project.year}</span> : null}
              <button
                type="button"
                data-drag-handle
                aria-label={`Drag ${project.name}; press Enter to bounce or Escape to reset`}
                title="Drag to move; release to spring back"
                className="project-drag-handle -my-2 flex min-h-11 min-w-11 touch-none cursor-grab items-center justify-center rounded border border-control font-mono text-ink-muted hover:bg-surface hover:text-ink active:cursor-grabbing motion-reduce:hidden"
              >
                <span aria-hidden="true">⠿</span>
              </button>
            </div>
            <div className="py-4 sm:py-6">
              {project.slug === 'petzo' ? (
                <p className="mb-3 font-mono text-xs tracking-widest text-ink-subtle">
                  SCAN → ANALYZE → CARE
                </p>
              ) : null}
              <h3 className="project-title font-display text-display-lg leading-tight font-semibold tracking-tight break-words text-ink">
                {project.name}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
                {project.summary}
              </p>
            </div>
            <div className="mt-auto">
              {project.tools.length > 0 ? (
                <ul
                  aria-label="Technologies"
                  className="mb-3 flex flex-wrap gap-2"
                >
                  {project.tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded bg-surface px-2.5 py-1 text-xs text-ink-muted"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-4 text-sm font-medium">
                {repository ? (
                  <a
                    className="inline-flex min-h-11 items-center gap-2 underline-offset-4 hover:underline"
                    href={repository}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub <ArrowUpRight size={15} />
                  </a>
                ) : null}
                {website ? (
                  <a
                    className="inline-flex min-h-11 items-center gap-2 underline-offset-4 hover:underline"
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Website <ArrowUpRight size={15} />
                  </a>
                ) : null}
                {hasDetail ? (
                  <Link
                    className="inline-flex min-h-11 items-center gap-2 text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                    to={`/project/${project.slug}`}
                  >
                    Project details <ArrowUpRight size={15} />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectShowcaseCard;
