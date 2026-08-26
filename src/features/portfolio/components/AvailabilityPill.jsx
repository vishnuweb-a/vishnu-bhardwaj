import { Pill } from '@/components/ui';
import { profile } from '../data';

// Shared by the navbar, the contact block and the project detail top bar.
// The dot is static: the reference shows no pulse and design.md section 9
// lists an availability animation as NOT OBSERVED, so none is added.
//
// className lands on a bare wrapper rather than on the Pill itself. Pill's own
// base classes include `inline-flex`, and an unprefixed `hidden` passed from a
// caller loses to it in the cascade - which silently left this pill visible at
// every width and pushed the navbar CTA off the right edge at 360px. The
// wrapper has no display utility of its own, so the caller's always wins.
export const AvailabilityPill = ({ className = '' }) => (
  <span className={className}>
    <Pill tone="raised" size="sm">
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full bg-accent"
      />
      {profile.availability}
    </Pill>
  </span>
);

export default AvailabilityPill;
