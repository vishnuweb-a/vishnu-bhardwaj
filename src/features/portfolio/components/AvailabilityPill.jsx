import { profile } from '../data';
export const AvailabilityPill = ({ className = '' }) => (
  <span className={className}>
    <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink">
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full bg-accent"
      />
      {profile.availability}
    </span>
  </span>
);

export default AvailabilityPill;
