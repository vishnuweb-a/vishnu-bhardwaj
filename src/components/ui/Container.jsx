// Four measured container widths at the 1440px reference baseline
// (design.md section 7). The default is unchanged from the original primitive:
// max-w-7xl with lg:px-8 yields a 1216px content column at 1440px, which is
// exactly the BASE measurement, so existing callers keep their behaviour.
//
// Complete class names only - never built dynamically (rule.md Rule 9).
const VARIANTS = {
  // BASE 1216 - hero lower row, contact footer, generic content
  base: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
  // WIDE 1280 with 80px gutters - nav, hero wordmark, service rows
  wide: 'mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14 xl:px-20',
  // NARROW 1104 - the projects grid
  narrow: 'mx-auto w-full max-w-[1168px] px-5 sm:px-8 lg:px-8',
  // PANEL 1408 - the inverted experience card, 16px from each page edge
  panel: 'mx-auto w-full max-w-[1440px] px-3 sm:px-4',
};

export const Container = ({ variant = 'base', children, className = '' }) => {
  return (
    <div className={`${VARIANTS[variant] ?? VARIANTS.base} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
