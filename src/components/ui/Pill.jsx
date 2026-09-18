const TONES = {
  // White floating pill with a hairline and the ambient lift.
  raised: 'bg-surface-raised text-ink border border-control',
  // Solid dark CTA.
  solid: 'bg-pill text-white',
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
  md: 'min-h-11 gap-2 px-5 py-2 text-sm',
  lg: 'min-h-12 gap-2.5 px-6 py-3 text-base',
};

const BASE =
  'inline-flex shrink-0 items-center justify-center font-medium leading-snug transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2';

export const Pill = ({
  as: Element = 'span',
  tone = 'raised',
  size = 'sm',
  className = '',
  children,
  ...props
}) => {
  const interactive =
    Element !== 'span' ? 'touch-manipulation rounded-md' : 'rounded-full';

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
