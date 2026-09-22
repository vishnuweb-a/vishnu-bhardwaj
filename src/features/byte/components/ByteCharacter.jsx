// BYTE's body: one inline SVG, drawn from the site's own vocabulary.
//
// Every colour is `currentColor` or a semantic token, so the character follows
// the theme for free - the same reason the rest of the UI carries no `dark:`
// variants (CLAUDE.md section 3). Geometry matches the icon set's language:
// a 1.6 stroke, round joins, and a flat geometric silhouette rather than
// illustration.
//
// The mood prop drives the face. Rather than animating a dozen parts
// independently, each mood picks one eye treatment and one mouth path, which
// is enough expression for a 104px character and keeps the state logic flat.

const EYE_SHUT = ['sleeping', 'sleepy', 'petted'];
const EYE_WIDE = ['excited', 'curious', 'dragged'];

const Mouth = ({ mood }) => {
  if (mood === 'happy' || mood === 'excited') {
    // Open, upturned.
    return (
      <path
        d="M29 41q3 3.4 6 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    );
  }
  if (mood === 'sleeping' || mood === 'sleepy') {
    return (
      <path
        d="M30 41.5h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    );
  }
  if (mood === 'petted') {
    return (
      <path
        d="M29.5 40.5q2.5 3 5 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    );
  }
  // Neutral: the small flat line the idle face carries.
  return (
    <path
      d="M30 41.2h4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.75"
    />
  );
};

export const ByteCharacter = ({ mood = 'idle', gaze = { x: 0, y: 0 } }) => {
  const shut = EYE_SHUT.includes(mood);
  const wide = EYE_WIDE.includes(mood);
  const blush = mood === 'happy' || mood === 'petted' || mood === 'excited';

  // Pupils travel a maximum of 1.6px from centre - small, because the eyes are
  // only about 5px across and any more reads as a squint rather than a glance.
  const pupilX = gaze.x * 1.6;
  const pupilY = gaze.y * 1.2;
  const eyeRadius = wide ? 2.6 : 2.2;

  return (
    <svg
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
      className="byte-svg overflow-visible text-ink"
    >
      {/* Ground shadow. Sits under everything and never scales with the body,
          so a hop lifts the pet away from its own shadow. */}
      <ellipse
        className="byte-shadow"
        cx="32"
        cy="59"
        rx="15"
        ry="3"
        fill="currentColor"
        opacity="0.13"
      />

      {/* Tail. Animated by CSS from its base, and the wag rate is a data
          attribute on the wrapper so mood drives speed without new markup. */}
      <path
        className="byte-tail"
        d="M47 47q9 1 8-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Ears */}
      <g className="byte-ears">
        <path
          d="M18 22 16.5 11l9 6.5Z"
          fill="currentColor"
          className="byte-ear byte-ear-left"
        />
        <path
          d="M46 22 47.5 11l-9 6.5Z"
          fill="currentColor"
          className="byte-ear byte-ear-right"
        />
      </g>

      {/* Head - the rounded slab that carries the face. */}
      <rect x="14" y="18" width="36" height="30" rx="11" fill="currentColor" />

      {/* Face plate. A recessed screen in the site's canvas colour, which is
          what makes the eyes read as display rather than as painted-on dots. */}
      <rect
        x="19"
        y="24"
        width="26"
        height="19"
        rx="8"
        className="fill-canvas"
      />

      <g className="text-ink">
        {shut ? (
          <>
            <path
              d="M24.5 33.5q2.5 2.4 5 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M34.5 33.5q2.5 2.4 5 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        ) : (
          <g className="byte-eyes">
            <circle
              cx={27 + pupilX}
              cy={33 + pupilY}
              r={eyeRadius}
              fill="currentColor"
            />
            <circle
              cx={37 + pupilX}
              cy={33 + pupilY}
              r={eyeRadius}
              fill="currentColor"
            />
          </g>
        )}

        <Mouth mood={mood} />
      </g>

      {/* Blush, on the face plate rather than the head so it sits beside the
          eyes. Accent-toned, so it picks up the theme's green in both modes. */}
      <g
        className="text-accent transition-opacity duration-200"
        opacity={blush ? 0.55 : 0}
      >
        <ellipse cx="22.5" cy="38" rx="2.6" ry="1.6" fill="currentColor" />
        <ellipse cx="41.5" cy="38" rx="2.6" ry="1.6" fill="currentColor" />
      </g>

      {/* The developer marking. Small enough to read as an engraving on the
          chest rather than as a logo. */}
      <text
        x="32"
        y="54"
        textAnchor="middle"
        className="byte-mark fill-ink"
        fontSize="8"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        opacity="0.45"
      >
        {'</>'}
      </text>

      {/* Paws */}
      <g fill="currentColor" className="byte-paws">
        <rect x="20" y="49" width="8" height="5" rx="2.5" />
        <rect x="36" y="49" width="8" height="5" rx="2.5" />
      </g>

      {/* Sleep marks. Rendered only while asleep and animated by CSS. */}
      {mood === 'sleeping' ? (
        <g className="byte-zzz text-ink-muted" fill="currentColor">
          <text x="50" y="18" fontSize="7" className="byte-z byte-z-1">
            z
          </text>
          <text x="55" y="11" fontSize="6" className="byte-z byte-z-2">
            z
          </text>
          <text x="59" y="6" fontSize="5" className="byte-z byte-z-3">
            z
          </text>
        </g>
      ) : null}
    </svg>
  );
};

export default ByteCharacter;
