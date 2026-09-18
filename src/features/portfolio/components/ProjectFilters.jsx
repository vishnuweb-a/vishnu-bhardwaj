import { PROJECT_CATEGORIES } from '../data';

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
          className={`inline-flex min-h-11 min-w-11 shrink-0 touch-manipulation items-center justify-center border-b-2 text-xs whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${
            isActive
              ? 'border-ink font-semibold text-ink'
              : 'border-transparent font-normal text-ink-muted hover:text-ink'
          }`}
        >
          {category}
        </button>
      );
    })}
  </div>
);

export default ProjectFilters;
