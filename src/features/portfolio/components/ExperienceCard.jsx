import { useAnimationOnHover, useScrollReveal } from '@/hooks';
import { revealOnScroll, scaleIn } from '@/animations';

export const ExperienceCard = ({ entry, index }) => {
  const revealRef = useScrollReveal(
    revealOnScroll({ translateY: [20, 0], duration: 650 })
  );
  const {
    ref: iconRef,
    onMouseEnter,
    onMouseLeave,
  } = useAnimationOnHover(
    scaleIn({ scale: 1, opacity: 1, rotate: 90, duration: 350 }),
    scaleIn({ scale: 1, opacity: 1, rotate: 0, duration: 350 })
  );

  return (
    <article
      id={`experience-${entry.id}`}
      data-experience-card
      aria-labelledby={`experience-title-${entry.id}`}
      tabIndex={-1}
      className="scroll-mt-28 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
    >
      <div
        ref={revealRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative isolate overflow-hidden rounded-3xl border border-line bg-surface-raised p-6 hover:border-control hover:bg-surface sm:p-8 lg:p-10"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-12 right-5 -z-10 font-display text-[8rem] leading-none text-ink/[0.035] select-none sm:right-8 sm:text-[10rem]"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex items-start justify-between gap-5">
          <p className="font-mono text-[11px] leading-relaxed tracking-widest text-ink-muted uppercase">
            {entry.category}
          </p>
          <span
            ref={iconRef}
            aria-hidden="true"
            className="shrink-0 text-ink-subtle"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" />
            </svg>
          </span>
        </div>
        <h3
          id={`experience-title-${entry.id}`}
          className="mt-6 max-w-2xl font-display text-3xl leading-tight text-ink sm:text-4xl"
        >
          {entry.role}
          {entry.organisation ? (
            <span className="mt-1 block text-ink-muted">
              {entry.organisation}
            </span>
          ) : null}
        </h3>
        {entry.period ? (
          <p className="mt-4 font-mono text-xs text-ink-muted tabular-nums">
            {entry.period}
          </p>
        ) : null}
        {entry.context ? (
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">
            {entry.context}
          </p>
        ) : null}
        {entry.detail ? (
          <p className="mt-6 max-w-prose text-sm leading-7 text-ink-muted sm:text-base">
            {entry.detail}
          </p>
        ) : null}
        {entry.proof?.length ? (
          <dl className="mt-7 grid gap-x-6 gap-y-5 rounded-2xl border border-line bg-canvas/60 p-5 sm:grid-cols-2">
            {entry.proof.map((proof) => (
              <div key={proof.title}>
                <dt className="text-sm font-medium text-ink">{proof.title}</dt>
                <dd className="mt-1 text-xs text-ink-muted">{proof.detail}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {entry.workflow ? (
          <div className="mt-7 rounded-2xl border border-line bg-canvas/60 p-5">
            <p className="mb-3 text-xs text-ink-muted">Contribution workflow</p>
            <ol className="flex flex-wrap gap-x-3 gap-y-2 font-mono text-[11px] tracking-wider text-ink uppercase">
              {entry.workflow.map((step, stepIndex) => (
                <li key={step}>
                  {stepIndex > 0 ? (
                    <span aria-hidden="true" className="mr-3 text-ink-subtle">
                      →
                    </span>
                  ) : null}
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
        {entry.technologies?.length ? (
          <ul
            aria-label="Technologies and focus areas"
            className="mt-7 flex flex-wrap gap-2"
          >
            {entry.technologies.map((technology) => (
              <li
                key={technology}
                className="rounded-full border border-line px-3 py-1 text-xs text-ink-muted"
              >
                {technology}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
};

export default ExperienceCard;
