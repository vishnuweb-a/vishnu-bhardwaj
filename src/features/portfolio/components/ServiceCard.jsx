import { ArrowUpRight, Braces } from '@/components/ui/icons';
import { useServiceTilt } from '../hooks/useServiceTilt';

export const ServiceCard = ({ service, index }) => {
  const ref = useServiceTilt();
  const compact = !service.technologies;
  return (
    <div ref={ref} className={`min-w-0 ${service.span}`}>
      <div
        data-service-reveal={(index % 2) * 80}
        className="h-full [perspective:900px]"
      >
        <article
          data-service-surface
          aria-labelledby={`service-${service.id}-heading`}
          className={`relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface-raised p-6 sm:p-8 lg:p-10 ${compact ? 'min-h-56' : 'min-h-96'}`}
        >
          {(service.id === 'web' || service.id === 'mobile') && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:32px_32px]"
            />
          )}
          {service.id === 'backend' && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-12 right-5 font-display text-8xl text-ink opacity-[0.035]"
            >
              API
            </span>
          )}
          {service.id === 'ai' && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-16 -right-10 size-40 rounded-full border border-ink/10 before:absolute before:inset-5 before:rounded-full before:border before:border-ink/10 after:absolute after:inset-10 after:rounded-full after:border after:border-dashed after:border-ink/10"
            />
          )}
          {service.id === 'mobile' && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-16 right-8 h-44 w-24 rotate-12 rounded-2xl border border-ink/10 before:absolute before:top-2 before:left-1/2 before:h-1 before:w-7 before:-translate-x-1/2 before:rounded-full before:bg-ink/10 after:absolute after:inset-x-7 after:bottom-2 after:border-t after:border-ink/10"
            />
          )}
          <div className="relative flex items-center justify-between gap-4">
            <p className="font-mono text-xs text-ink-muted">
              {service.category}
            </p>
            <span aria-hidden="true" className="text-ink-muted">
              {service.id === 'ui' ? (
                <Braces size={20} />
              ) : service.id === 'workflows' ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 12c-3-5-4-6-6-6a6 6 0 0 0 0 12c2 0 3-1 6-6s4-6 6-6a6 6 0 0 1 0 12c-2 0-3-1-6-6Z" />
                </svg>
              ) : (
                <ArrowUpRight size={20} />
              )}
            </span>
          </div>
          <h3
            id={`service-${service.id}-heading`}
            className={`relative mt-8 font-display leading-tight font-medium tracking-tight text-ink ${compact ? 'text-2xl sm:text-3xl' : 'text-display-md'}`}
          >
            {service.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h3>
          <p className="relative mt-4 max-w-[48ch] text-sm leading-relaxed text-ink-muted">
            {service.description}
          </p>
          {service.technologies && (
            <ul
              aria-label="Technologies"
              className="relative mt-auto flex flex-wrap gap-2 pt-8"
            >
              {service.technologies.map((technology) => (
                <li
                  key={technology}
                  className="rounded-full border border-line bg-surface/70 px-3 py-1 font-mono text-xs text-ink-muted"
                >
                  {technology}
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </div>
  );
};

export default ServiceCard;
