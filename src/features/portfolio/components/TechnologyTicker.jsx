import { serviceTechnologies } from '../data/services';

export const TechnologyTicker = ({ paused, onToggle }) => (
  <div className="mt-10 flex min-w-0 items-center border-y border-line py-2 sm:mt-12">
    <p className="sr-only">{serviceTechnologies.join(', ')}</p>
    <div className="min-w-0 flex-1 overflow-hidden" aria-hidden="true">
      <div
        data-service-ticker
        className="flex w-max motion-reduce:!transform-none motion-reduce:w-full motion-reduce:flex-wrap"
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className={`flex shrink-0 items-center motion-reduce:w-full motion-reduce:flex-wrap ${copy ? 'motion-reduce:hidden' : ''}`}
          >
            {serviceTechnologies.map((technology) => (
              <span
                key={technology}
                className="flex shrink-0 items-center gap-6 py-3 pr-6 font-mono text-xs text-ink-muted sm:gap-8 sm:pr-8"
              >
                {technology}
                <span className="text-ink-subtle">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
    <button
      type="button"
      onClick={onToggle}
      aria-label={paused ? 'Resume Services motion' : 'Pause Services motion'}
      className="ml-3 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border border-control px-3 text-xs text-ink-muted hover:bg-surface hover:text-ink motion-reduce:hidden"
    >
      <span aria-hidden="true">{paused ? 'Resume' : 'Pause'}</span>
      <span className="hidden sm:inline" aria-hidden="true">
        motion
      </span>
    </button>
  </div>
);

export default TechnologyTicker;
