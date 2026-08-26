// A /SECTION heading sitting over its own name repeated as a ghost watermark
// (design.md section 3). The slash is a real glyph in the same run at the same
// size and weight - not an icon and not a pseudo-element.
//
// The watermark is a decorative duplicate of the heading, so it is aria-hidden
// to stop screen readers announcing every section name twice (design.md 19).

export const SectionHeading = ({
  label,
  watermark,
  align = 'left',
  onPanel = false,
  as: Element = 'h2',
  id,
  className = '',
  children,
}) => {
  const alignment =
    align === 'center' ? 'items-center text-center' : 'items-start text-left';
  const ink = onPanel ? 'text-on-panel' : 'text-ink';
  const ghost = onPanel ? 'text-panel-ghost' : 'text-ink-ghost';

  return (
    <div className={`relative flex flex-col ${alignment} ${className}`}>
      {watermark ? (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -top-[0.58em] left-1/2 -translate-x-1/2 max-w-none select-none font-display text-watermark leading-none font-light tracking-[0.08em] whitespace-nowrap uppercase ${ghost}`}
        >
          {watermark}
        </span>
      ) : null}
      <Element
        id={id}
        className={`relative font-display text-display-md leading-[0.95] font-normal tracking-[0.02em] uppercase ${ink}`}
      >
        {label}
      </Element>
      {children}
    </div>
  );
};

export default SectionHeading;
