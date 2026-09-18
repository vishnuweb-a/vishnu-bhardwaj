// Inline SVG icon set. No icon package is installed and none should be
// (CLAUDE.md section 18). Every icon shares a 1.6 stroke and a 24 viewBox so
// they optically match at any size. All are decorative by default; the control
// that wraps them carries the accessible name.
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const Svg = ({ children, size = 16, className = '', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
);

export const ArrowUpRight = (props) => (
  <Svg {...props}>
    <path d="M7 17 17 7" {...stroke} />
    <path d="M8.5 7H17v8.5" {...stroke} />
  </Svg>
);

export const Download = (props) => (
  <Svg {...props}>
    <path d="M12 4v10" {...stroke} />
    <path d="m7.5 10 4.5 4 4.5-4" {...stroke} />
    <path d="M5 19h14" {...stroke} />
  </Svg>
);

export const ArrowLeft = (props) => (
  <Svg {...props}>
    <path d="M19 12H5" {...stroke} />
    <path d="m11 6-6 6 6 6" {...stroke} />
  </Svg>
);

export const Close = (props) => (
  <Svg {...props}>
    <path d="M6 6 18 18" {...stroke} />
    <path d="M18 6 6 18" {...stroke} />
  </Svg>
);

export const Menu = (props) => (
  <Svg {...props}>
    <path d="M4 7h16" {...stroke} />
    <path d="M4 12h16" {...stroke} />
    <path d="M4 17h16" {...stroke} />
  </Svg>
);

export const GitHub = (props) => (
  <Svg {...props}>
    <path
      d="M9 19.5c-4 1.2-4-2.1-5.5-2.6m11 5v-3.2a2.8 2.8 0 0 0-.8-2.2c2.6-.3 5.3-1.3 5.3-5.8a4.5 4.5 0 0 0-1.2-3.1 4.2 4.2 0 0 0-.1-3.1s-1-.3-3.3 1.2a11.3 11.3 0 0 0-5.8 0C6.3 4.2 5.3 4.5 5.3 4.5a4.2 4.2 0 0 0-.1 3.1A4.5 4.5 0 0 0 4 10.7c0 4.5 2.7 5.5 5.3 5.8a2.8 2.8 0 0 0-.8 2.2v3.2"
      {...stroke}
    />
  </Svg>
);

export const Mail = (props) => (
  <Svg {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" {...stroke} />
    <path d="m4 7 8 5.5L20 7" {...stroke} />
  </Svg>
);

export const Phone = (props) => (
  <Svg {...props}>
    <path
      d="M16.2 21a15.3 15.3 0 0 1-13.2-13.2 2 2 0 0 1 2-2.2h2.6a1.4 1.4 0 0 1 1.4 1.2c.1 1 .4 1.9.7 2.8a1.4 1.4 0 0 1-.3 1.5l-1 1a13 13 0 0 0 5.1 5.1l1-1a1.4 1.4 0 0 1 1.5-.3c.9.3 1.8.6 2.8.7a1.4 1.4 0 0 1 1.2 1.4v2.6a2 2 0 0 1-2.2 2Z"
      {...stroke}
    />
  </Svg>
);

export const LinkedIn = (props) => (
  <Svg {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" {...stroke} />
    <path d="M7.5 10.5V17" {...stroke} />
    <circle cx="7.5" cy="7.3" r="0.9" fill="currentColor" stroke="none" />
    <path d="M11.5 17v-3.6a2.4 2.4 0 0 1 4.8 0V17" {...stroke} />
    <path d="M11.5 10.5V17" {...stroke} />
  </Svg>
);

export const Server = (props) => (
  <Svg {...props}>
    <rect x="3" y="4" width="18" height="7" rx="2" {...stroke} />
    <rect x="3" y="13" width="18" height="7" rx="2" {...stroke} />
    <path d="M7 7.5h.01M7 16.5h.01" {...stroke} />
  </Svg>
);

export const Database = (props) => (
  <Svg {...props}>
    <ellipse cx="12" cy="6" rx="7.5" ry="3" {...stroke} />
    <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" {...stroke} />
    <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" {...stroke} />
  </Svg>
);

export const Braces = (props) => (
  <Svg {...props}>
    <path
      d="M8 4a2.5 2.5 0 0 0-2.5 2.5v2A2.5 2.5 0 0 1 3 11a2.5 2.5 0 0 1 2.5 2.5v2A2.5 2.5 0 0 0 8 18"
      {...stroke}
    />
    <path
      d="M16 4a2.5 2.5 0 0 1 2.5 2.5v2A2.5 2.5 0 0 0 21 11a2.5 2.5 0 0 0-2.5 2.5v2A2.5 2.5 0 0 1 16 18"
      {...stroke}
    />
  </Svg>
);

export const Cloud = (props) => (
  <Svg {...props}>
    <path
      d="M7 18a4 4 0 0 1-.4-8 5.5 5.5 0 0 1 10.6 1.2A3.4 3.4 0 0 1 17 18Z"
      {...stroke}
    />
  </Svg>
);

export const Sparkle = (props) => (
  <Svg {...props}>
    <path
      d="M12 3.5 13.8 9 19 10.8 13.8 12.6 12 18l-1.8-5.4L5 10.8 10.2 9Z"
      {...stroke}
    />
  </Svg>
);
