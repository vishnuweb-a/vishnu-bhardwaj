import { PROJECT_CATEGORIES } from '../data';

// The active filter reads as a weight-and-colour change with no underline and
// no pill in the reference ([measured], design.md section 11). No transition
// animation is applied when switching - that is on the NOT OBSERVED list.
//
// State is written to the URL query rather than held locally, which makes a
// filtered view shareable and keeps the back button correct
// (design.md section 19).
export const ProjectFilters = ({ active, onChange }) => (
  <div
    role="group"
    aria-label="Filter projects by category"
    className="-mx-1 flex items-center gap-6 overflow-x-auto px-1 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0"
  >
    {PROJECT_CATEGORIES.map((category) => {
      const isActive = category === active;

      return (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          aria-pressed={isActive}
          className={`inline-flex min-h-11 min-w-11 shrink-0 touch-manipulation items-center justify-center rounded-sm text-base whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
            isActive
              ? 'font-semibold text-ink'
              : 'font-normal text-ink-muted hover:text-ink'
          }`}
        >
          {category}
        </button>
      );
    })}
  </div>
);

export default ProjectFilters;
