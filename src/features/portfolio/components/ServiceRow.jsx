import { useId } from 'react';
import { MediaFrame } from '@/components/ui';
import {
  ArrowUpRight,
  Close,
  Server,
  Database,
  Cloud,
  Braces,
} from '@/components/ui/icons';

const ICONS = {
  backend: Server,
  distributed: Braces,
  data: Database,
  infrastructure: Cloud,
};

// Preserve the single-open disclosure while keeping its content in the grid.
export const ServiceRow = ({ service, index, expanded, onToggle }) => {
  const panelId = useId();
  const triggerId = useId();
  const Icon = ICONS[service.id] ?? Server;
  return (
    <div className="border-b border-line hover:bg-canvas">
      <h3>
        <button
          id={triggerId}
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 rounded-sm py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 sm:gap-6 lg:grid-cols-[56px_1fr_auto]"
        >
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-md bg-surface text-accent"
          >
            <Icon size={21} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
            {service.title}
          </span>
          <span
            aria-hidden="true"
            className="flex items-center gap-6 text-ink-muted"
          >
            <span className="hidden font-mono text-xs tabular-nums sm:inline">
              {String(index + 1).padStart(2, '0')}
            </span>
            {expanded ? <Close size={20} /> : <ArrowUpRight size={20} />}
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!expanded}
      >
        <div className="grid items-center gap-6 pb-6 sm:grid-cols-[1fr_200px] sm:pl-16 lg:pl-20">
          <p className="max-w-[65ch] text-sm leading-relaxed text-ink-muted">
            {service.description}
          </p>
          <MediaFrame
            src={service.media}
            alt={service.mediaAlt}
            ratio="wide"
            fit="contain"
            width={1280}
            height={720}
            rounded="rounded-md"
            className="w-full max-w-64"
          />
        </div>
      </div>
    </div>
  );
};
export default ServiceRow;
