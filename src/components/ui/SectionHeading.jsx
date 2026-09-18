// The heading keeps the original copy; hierarchy comes from type and spacing.

export const SectionHeading = ({
  label,
  watermark: _watermark,
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

  return (
    <div className={`relative flex flex-col ${alignment} ${className}`}>
      <Element
        id={id}
        className={`relative text-display-md leading-tight font-semibold tracking-tight ${ink}`}
      >
        {label}
      </Element>
      {children}
    </div>
  );
};

export default SectionHeading;
