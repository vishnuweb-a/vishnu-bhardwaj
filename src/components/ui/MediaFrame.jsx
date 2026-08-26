// Fixed-aspect media module (image-to-code section 20, design.md section 20).
// The aspect ratio is set on the frame, not the image, so the box reserves its
// space before the image decodes and nothing shifts on load.
//
// A frame with no `src` renders a neutral local block at the correct
// proportions carrying whatever label it is given, so a slot with no asset on
// record is still laid out correctly rather than broken. A caller that has
// something better to show there passes `fallback`.
//
// `fit` and `position` exist because every capture the owner supplied is a tall
// device frame. The card, service and experience frames are fed a 16:9
// composition built for them, so they cover cleanly; the detail route shows the
// capture itself and needs `contain`. `position` is available for a future
// asset whose subject is not centred.

const FITS = {
  cover: 'object-cover',
  contain: 'object-contain',
};

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
  fallback,
  fit = 'cover',
  position,
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
          style={position ? { objectPosition: position } : undefined}
          className={`h-full w-full ${FITS[fit] ?? FITS.cover} ${imageClassName}`}
        />
      ) : (
        (fallback ?? (
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-end justify-start bg-surface p-4"
          >
            {label ? (
              <span className="text-[0.6875rem] font-medium tracking-[0.14em] text-ink-subtle uppercase">
                {label}
              </span>
            ) : null}
          </span>
        ))
      )}
      {children}
    </div>
  );
};

export default MediaFrame;
