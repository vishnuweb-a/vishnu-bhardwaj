import { Link } from 'react-router-dom';
import { MediaFrame } from '@/components/ui';
import { ArrowUpRight } from '@/components/ui/icons';
import { useAnimationOnHover } from '@/hooks';
import { scaleIn, scaleOut } from '@/animations';

// Both presentations read the same immutable project record.
export const ProjectCard = ({ project, featured = false, reverse = false }) => {
  const { ref, onMouseEnter, onMouseLeave } = useAnimationOnHover(
    scaleIn({ scale: 1.02, opacity: 1, duration: 250, ease: 'outQuad' }),
    scaleOut({ scale: 1, opacity: 1, duration: 250, ease: 'outQuad' })
  );
  if (!project.thumbnail) {
    return (
      <article>
        <Link
          to={`/project/${project.slug}`}
          className="group grid items-start gap-4 border-b border-line py-6 hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] md:gap-8"
        >
          <div>
            <span className="text-[0.625rem] font-semibold tracking-widest text-ink-subtle uppercase">
              {project.category}
            </span>
            <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-ink">
              {project.title}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
              {(project.tags ?? []).map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm leading-relaxed text-ink-muted">
              {project.summary}
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {(project.tools ?? []).map((tool) => (
                <li
                  key={tool}
                  className="rounded bg-surface px-2 py-1 text-xs text-ink-muted"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
          <ArrowUpRight
            size={20}
            className="hidden text-ink-muted group-hover:text-ink md:block"
          />
        </Link>
      </article>
    );
  }

  return (
    <article className="h-full">
      <Link
        to={`/project/${project.slug}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`group h-full overflow-hidden rounded-lg border border-line bg-surface-raised hover:border-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${featured ? 'grid md:grid-cols-2' : 'flex flex-col'}`}
      >
        <div
          className={`overflow-hidden ${featured && reverse ? 'md:order-2' : ''}`}
        >
          <div ref={ref} className="h-full">
            <MediaFrame
              src={project.thumbnail}
              alt={project.thumbnailAlt}
              ratio="wide"
              fit="contain"
              width={1280}
              height={720}
              rounded="rounded-none"
              className={featured ? 'h-full w-full' : 'w-full'}
            />
          </div>
        </div>
        <div
          className={`flex min-w-0 flex-1 flex-col ${featured ? 'p-6 lg:p-9' : 'p-5'}`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-[0.625rem] font-semibold tracking-widest text-ink-subtle uppercase">
              {project.category}
            </span>
            <ArrowUpRight
              size={18}
              className="shrink-0 text-ink-muted group-hover:text-ink"
            />
          </div>
          <h3
            className={`mt-3 font-semibold tracking-tight text-ink ${featured ? 'text-2xl leading-tight lg:text-3xl' : 'text-lg leading-snug'}`}
          >
            {project.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {project.summary}
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
            {(project.tags ?? []).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          {featured ? (
            <p className="mt-4 text-xs font-medium text-ink">{project.role}</p>
          ) : null}
          <div className="grow" />
          <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-line pt-4">
            {(project.tools ?? []).map((tool) => (
              <li
                key={tool}
                className="rounded bg-surface px-2 py-1 text-[0.625rem] font-medium text-ink-muted"
              >
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </article>
  );
};
export default ProjectCard;
