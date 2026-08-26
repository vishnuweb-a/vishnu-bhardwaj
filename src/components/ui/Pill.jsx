// The reference's defining component: every discrete control is a full-radius
// pill (design.md section 3). Pill renders whichever element the caller needs -
// a link, a button, or a plain span for non-interactive chips - so the geometry
// stays in one place instead of being re-declared per section.
//
// minimalist-ui bans rounded-full on controls; that opinion is overridden here
// because pill geometry is the reference's component language (design.md 17).

const TONES = {
  // White floating pill with a hairline and the ambient lift.
  raised: 'bg-surface-raised text-ink border border-line shadow-pill',
  // Solid dark CTA.
  solid: 'bg-pill text-white shadow-pill',
  // Flat chip on a light surface - tags and categories.
  outline: 'bg-transparent text-ink-muted border border-line',
  // White chip sitting on the card's --color-surface body.
  chip: 'bg-surface-raised text-ink-muted border border-line',
  // Flat chip on the inverted panel.
  onPanel: 'bg-white/5 text-on-panel border border-panel-line',
};

const SIZES = {
  xs: 'h-7 gap-1.5 px-3 text-[0.8125rem]',
  sm: 'h-9 gap-2 px-4 text-[0.9375rem]',
  md: 'h-11 gap-2 px-5 text-base',
  lg: 'h-12 gap-2.5 px-6 text-lg',
};

const BASE =
  'inline-flex shrink-0 items-center justify-center rounded-full font-medium leading-none whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2';

export const Pill = ({
  as: Element = 'span',
  tone = 'raised',
  size = 'sm',
  className = '',
  children,
  ...props
}) => {
  const interactive =
    Element === 'a' || Element === 'button' ? 'touch-manipulation' : '';

  return (
    <Element
      className={`${BASE} ${TONES[tone] ?? TONES.raised} ${SIZES[size] ?? SIZES.sm} ${interactive} ${className}`}
      {...props}
    >
      {children}
    </Element>
  );
};

export default Pill;
