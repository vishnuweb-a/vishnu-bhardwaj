import { useId } from 'react';
import { MediaFrame } from '@/components/ui';
import { ArrowUpRight, Close } from '@/components/ui/icons';

// One accordion row (design.md section 10).
//
// Collapsed: a ~68px display title, a thin arrow affordance and a 1px hairline
// beneath, on no background at all.
//
// Expanded: the row becomes a --color-panel block at ~16px radius spanning the
// full WIDE container, the title turns white, a description appears beneath it,
// the arrow is replaced by a close glyph, and a work-sample card overhangs the
// panel's top edge rotated about -4 degrees ([measured]).
//
// Trigger: the video shows the cursor resting on the row before it expands and
// the expanded state carries a close affordance, but hover-versus-click is not
// resolvable from the recording. This implements the accessible reading - a
// real button toggled by click, Enter and Space - and records the ambiguity
// rather than guessing silently (rule.md Rule 4, design.md section 10).
//
// The height change is the project's single sanctioned layout animation: a CSS
// transition on grid-template-rows via the .collapsible utility, never a JS
// height animation (rule.md Rule 6). Everything else moves on opacity and
// transform only.
export const ServiceRow = ({ service, expanded, onToggle }) => {
  const panelId = useId();
  const triggerId = useId();

  return (
    <div
      data-reveal-row
      className={`relative transition-colors duration-500 ${
        expanded
          ? 'rounded-2xl bg-panel'
          : 'border-b border-line bg-transparent'
      }`}
    >
      {/* The overhanging work sample. Decorative, so it is aria-hidden and
          never announced; the row's accessible name is its title. */}
      {expanded ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[74px] right-[140px] z-10 hidden w-[290px] rotate-[-4deg] rounded-xl bg-surface-raised p-2 shadow-float lg:block xl:right-[240px] xl:w-[340px]"
        >
          <MediaFrame
            src={service.media}
            alt=""
            label={service.title}
            ratio="wide"
            width={240}
            height={135}
            rounded="rounded-lg"
          />
        </div>
      ) : null}

      <h3>
        <button
          id={triggerId}
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={panelId}
          className={`flex w-full touch-manipulation items-center justify-between gap-6 rounded-2xl px-4 text-left transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:px-6 lg:px-7 ${
            expanded
              ? 'pt-9 pb-3 text-on-panel focus-visible:ring-on-panel focus-visible:ring-offset-panel'
              : 'py-9 text-ink focus-visible:ring-ink focus-visible:ring-offset-canvas lg:py-[3.4rem]'
          }`}
        >
          <span className="font-display text-display-lg leading-[0.95] font-normal tracking-[0.01em] uppercase">
            {service.title}
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 opacity-80 transition-opacity duration-300"
          >
            {expanded ? <Close size={28} /> : <ArrowUpRight size={26} />}
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        data-expanded={expanded}
        className="collapsible rounded-b-2xl bg-panel"
      >
        <div>
          <div className="px-4 pb-9 sm:px-6 lg:px-7">
            <p className="max-w-[420px] text-base text-on-panel-muted">
              {service.description}
            </p>

            {/* Below lg the sample stacks under the description instead of
                overhanging, which there is no room for. Inferred responsive
                behaviour (design.md section 16). */}
            <div className="mt-6 w-full max-w-[280px] rotate-[-3deg] rounded-xl bg-surface-raised p-2 shadow-float lg:hidden">
              <MediaFrame
                src={service.media}
                alt=""
                label={service.title}
                ratio="wide"
                width={280}
                height={158}
                rounded="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRow;
