import { Link } from 'react-router-dom';
import { MediaFrame, Pill } from '@/components/ui';
import { ArrowUpRight } from '@/components/ui/icons';
import { usePointerFollow } from '@/hooks';

// Card anatomy measured from project.webp and video t=5.6-7.5
// (design.md section 11): a --color-surface body at ~12px radius holding a
// fixed 1.4:1 media frame, a persistent category badge, a title of up to two
// lines and a row of tag chips.
//
// The badge is persistent, not hover-revealed: it is present at video t=6.27
// before any hover affordance appears and on the non-hovered card at t=6.35
// (design.md section 17, row 5).
//
// On hover a white circular button holding an arrow fades in over the media and
// then follows the pointer with easing. What does NOT happen, per the same
// analysis: the media does not scale, the surface does not change colour, and
// the card does not lift. None of those are added.
//
// The whole card is one real link, so the destination is reachable by keyboard
// and by middle-click, and the follower stays decorative.
export const ProjectCard = ({ project }) => {
  const { containerRef, followerRef } = usePointerFollow({
    settings: { x: 320, y: 320, ease: 'outQuad' },
  });

  return (
    <article className="h-full">
      <Link
        to={`/project/${project.slug}`}
        ref={containerRef}
        className="group flex h-full flex-col rounded-xl bg-surface p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
      >
        <MediaFrame
          src={project.thumbnail}
          alt={project.thumbnail ? project.thumbnailAlt : ''}
          label="Preview pending"
          ratio="card"
          width={520}
          height={372}
          rounded="rounded-lg"
        >
          <span className="absolute top-3 left-3 z-10 inline-flex h-6 items-center rounded-full bg-surface-raised px-2.5 text-[0.625rem] font-semibold tracking-[0.08em] text-ink uppercase shadow-pill">
            {project.category}
          </span>

          {/* Decorative pointer follower. Authored hidden because it exists
              only while a fine pointer is inside the card; under reduced motion
              usePointerFollow never activates and it stays out of the way,
              which is what design.md section 18 specifies. */}
          <span
            ref={followerRef}
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="pointer-events-none absolute top-0 left-0 z-20 inline-flex size-[54px] items-center justify-center rounded-full bg-surface-raised text-ink shadow-float"
          >
            <ArrowUpRight size={20} />
          </span>
        </MediaFrame>

        <h3 className="mt-4 px-1 text-xl leading-snug font-medium text-ink">
          {project.title}
        </h3>

        <ul className="mt-4 mb-1 flex flex-wrap gap-2 px-1">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Pill tone="chip" size="xs">
                {tag}
              </Pill>
            </li>
          ))}
        </ul>
      </Link>
    </article>
  );
};

export default ProjectCard;
