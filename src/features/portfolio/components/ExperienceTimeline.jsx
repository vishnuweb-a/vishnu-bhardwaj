export const ExperienceTimeline = ({ entries, activeIndex }) => (
  <nav
    aria-label="Experience timeline"
    className="sticky top-28 hidden max-h-[calc(100dvh-8rem)] self-start overflow-y-auto p-1 lg:block"
  >
    <p className="mb-5 font-mono text-[11px] tracking-[0.18em] text-ink-muted uppercase">
      Timeline
    </p>
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute top-7 bottom-7 left-2 w-px bg-line"
      >
        <span
          className="block h-full w-full origin-top bg-ink"
          style={{
            transform: `scaleY(${activeIndex / Math.max(1, entries.length - 1)})`,
          }}
        />
      </div>
      <ol className="relative">
        {entries.map((entry, index) => (
          <li key={entry.id}>
            <a
              href={`#experience-${entry.id}`}
              aria-current={index === activeIndex ? 'step' : undefined}
              className={`group relative grid min-h-14 grid-cols-[1rem_1fr] items-center gap-4 rounded-md py-2 pr-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${index === activeIndex ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
            >
              <span
                aria-hidden="true"
                className={`relative mx-auto size-2 rounded-full border ${index === activeIndex ? 'border-ink bg-ink ring-4 ring-ink/10' : 'border-control bg-canvas group-hover:bg-ink-muted'}`}
              />
              <span>
                <span className="block font-mono text-xs font-medium tracking-widest">
                  {entry.timeline}
                </span>
                <span className="mt-0.5 block text-xs">
                  {entry.timelineLabel}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  </nav>
);

export default ExperienceTimeline;
