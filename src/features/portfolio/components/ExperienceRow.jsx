export const ExperienceRow = ({ entry }) => (
  <li className="relative grid grid-cols-1 gap-3 border-b border-line py-6 pl-6 hover:bg-surface-raised sm:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] sm:gap-x-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.65fr)] lg:py-7">
    <span
      aria-hidden="true"
      className="absolute top-0 bottom-0 left-0 border-l border-line"
    />
    <span
      aria-hidden="true"
      className="absolute top-8 -left-1 size-2 rounded-full bg-ink"
    />
    <p className="text-xs leading-relaxed text-ink-muted tabular-nums">
      {entry.period}
    </p>
    <div>
      <h3 className="text-base leading-snug font-semibold text-ink">
        {entry.role}
      </h3>
      <p className="mt-1 text-sm text-ink-muted">{entry.organisation}</p>
    </div>
    {entry.detail ? (
      <p className="max-w-prose text-sm leading-relaxed text-ink-muted sm:col-start-2 lg:col-start-auto">
        {entry.detail}
      </p>
    ) : null}
  </li>
);
export default ExperienceRow;
