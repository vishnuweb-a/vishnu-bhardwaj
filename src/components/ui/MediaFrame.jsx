// Fixed-aspect media module (image-to-code section 20, design.md section 20).
// The aspect ratio is set on the frame, not the image, so the box reserves its
// space before the image decodes and nothing shifts on load.
//
// No real project imagery exists yet. Rather than shipping fabricated
// screenshots or calling a remote placeholder service, a frame with no `src`
// renders a neutral local block at the correct proportions carrying the asset's
// own label. Dropping a path into the data layer replaces it with no JSX change.

const RATIOS = {
  card: 'aspect-[1.4/1]',
  wide: 'aspect-[16/9]',
  page: 'aspect-[4/3]',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
};

export const MediaFrame = ({
  src,
  alt = '',
  label,
  ratio = 'card',
  width,
  height,
  loading = 'lazy',
  fetchPriority,
  rounded = 'rounded-lg',
  className = '',
  imageClassName = '',
  children,
}) => {
  return (
    <div
      className={`relative isolate overflow-hidden bg-surface ${RATIOS[ratio] ?? RATIOS.card} ${rounded} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-end justify-start bg-surface p-4"
        >
          <span className="text-[0.6875rem] font-medium tracking-[0.14em] text-ink-subtle uppercase">
            {label ?? 'Image pending'}
          </span>
        </span>
      )}
      {children}
    </div>
  );
};

export default MediaFrame;
