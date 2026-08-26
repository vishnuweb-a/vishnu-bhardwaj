// A single experience row (design.md section 12). Company over role on the
// left, period right-aligned, a 1px --color-panel-line rule between rows.
//
// This is a two-column list, not a timeline. No rail, no connector, no dot and
// no node marker appears in any reference and none is added (rule.md Rule 4).
//
// Row text brightening on hover is NOT OBSERVED - the recording is not
// conclusive - so the row's only hover behaviour is the shared pointer
// follower owned by the parent section.
//
// Below 768px the period moves under the role and left-aligns; inferred
// responsive behaviour (design.md section 16).
export const ExperienceRow = ({ entry, onPointerEnter }) => (
  <li
    data-reveal-row
    onPointerEnter={onPointerEnter}
    className="grid grid-cols-1 gap-1 border-b border-panel-line py-7 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-8 lg:py-8"
  >
    <div>
      <h3 className="text-lg leading-snug font-medium text-on-panel">
        {entry.organisation}
      </h3>
      <p className="mt-1 text-base text-on-panel-muted">{entry.role}</p>
    </div>
    <p className="text-base text-on-panel-muted sm:text-right">
      {entry.period}
    </p>
  </li>
);

export default ExperienceRow;
