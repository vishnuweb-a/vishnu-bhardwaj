# Portfolio

A production-grade React application built with modern web technologies.

## Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Lightning-fast build tool with HMR
- **Tailwind CSS v4** - Utility-first CSS framework
- **Anime.js** - Powerful animation library
- **ESLint** - Code quality linting
- **Prettier** - Code formatting

## Requirements

- Node.js >= 20.19.0
- npm >= 10.0.0

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application is served at `http://localhost:5173`.

## Production Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Code Quality

Run ESLint:

```bash
npm run lint
```

Format code with Prettier:

```bash
npm run format
```

Check Prettier formatting:

```bash
npm run format:check
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_APP_NAME=Portfolio
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3000
VITE_ENABLE_ANIMATIONS=true
```

## Project Structure

```
src/
├── app/               # Application entry point
│   ├── App.jsx       # Root component
│   ├── main.jsx      # React DOM mount
│   ├── config/       # Application configuration
│   ├── providers/    # Global providers (Theme, Auth, etc.)
│   └── routes/       # Route definitions
├── animations/        # Centralized animation system
│   ├── presets/      # Reusable animation presets
│   ├── utils/        # Animation utilities
│   └── index.js      # Barrel exports
├── components/        # Reusable UI components
│   ├── ui/           # Primitive UI components
│   └── feedback/     # Feedback state components
├── features/         # Feature-oriented modules
├── hooks/            # Custom React hooks
├── layouts/          # Page layouts
├── pages/            # Page components
├── services/         # API and external services
├── store/            # Global state management
├── styles/           # Global stylesheet (index.css)
├── utils/            # Utility functions
└── lib/              # Shared libraries
```

## Architecture Principles

### Feature-Oriented Architecture

Business logic is organized by feature, not by layer. Each feature contains its own:

- Components
- Hooks
- Services
- Utilities
- Pages (if applicable)

### Centralized Animation System

Animations are centralized in `src/animations/`:

- Reusable animation presets
- React hooks for animations (`useAnimation`, `useAnimationOnHover`)
- Utilities for safe animation management
- Respects `prefers-reduced-motion`

### Reusable UI Components

Primitive, generic components live in `src/components/ui/`:

- Button, Card, Container
- Accessible and keyboard-friendly
- No business logic
- Highly composable

### API Layer

All API calls go through `src/services/api/client.js`:

- Centralized HTTP client
- Easy to replace/mock
- Consistent error handling

### Configuration

Application configuration is centralized:

- Environment variables via `.env`
- `src/app/config/index.js` for configuration objects

## Animation Architecture

Anime.js is integrated through a React-safe abstraction:

1. **Presets** - Reusable animation configurations
2. **Utils** - Helper functions for creating animations
3. **Hooks** - React hooks for component-level animations

Example usage:

```jsx
import { useAnimation } from '@/hooks';
import { slideUp } from '@/animations';

function Component() {
  const ref = useAnimation(slideUp({ delay: 150 }));

  return <div ref={ref}>Content</div>;
}
```

Presets are plain factory functions returning an Anime.js v4 config, so they
compose with per-call overrides. `useAnimation` captures the config on first
render and runs the animation once on mount inside an Anime.js scope, which is
reverted on unmount.

When `prefers-reduced-motion: reduce` is set, `useAnimation` skips the
animation entirely. Elements are authored in their final visual state, so the
page stays fully usable without motion.

## Styling Architecture

1. **Tailwind utilities** - Primary styling method
2. **Component-level styles** - When genuinely required
3. **Global styles** - Only for global concerns

Avoid writing CSS for things Tailwind already handles.

## Performance Considerations

- GPU-friendly animations (transform, opacity)
- Code splitting via Vite's rollupOptions
- Optimized bundle with vendor separation
- ESM modules for modern browsers

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES2021 support
- Mobile-friendly (responsive design)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check Prettier formatting

## Contributing

1. Follow the project structure
2. Keep components small and focused
3. Use the centralized animation system
4. Run ESLint and Prettier before committing
5. Keep commits atomic and well-described

---

## Media Pipeline

The owner's original screenshots and portrait are full-size PNGs, about 10 MB in
total. They are **not** served. They live in `information/source-assets/`, which
Vite never copies, and `scripts/build-assets.py` derives an optimised WebP for
each into `src/assets/images/` (about 390 KB in total).

```
information/source-assets/*.png     originals, never modified, never served
        |
        v  python scripts/build-assets.py    (Pillow; run manually)
        |
src/assets/images/*.webp            the only media the site loads
        |
        v  imported through src/features/portfolio/data/
        |
        v  Vite fingerprints and emits them into dist/assets/
```

Importing through the data layer means a missing asset fails the build rather
than 404ing at runtime, and every file is content-hashed. Never write a raw
`/something.png` path into JSX or a data file.

`public/` holds only what must be served verbatim: `favicon.svg` and
`robots.txt`.

## Deployment

`npm run build` emits a static site to `dist/`. There is no server component and
no runtime environment variable - `.env` only feeds the unused scaffold in
`src/app/config/` and `src/services/`, and nothing from it reaches the bundle.

**SPA rewrite support is configured out of the box.** The site uses
`createBrowserRouter`, so `/project/<slug>` is a real URL with no matching file
in `dist/`. SPA routing fallbacks are provided for common static hosts:

- **Netlify / Cloudflare Pages / Render** - `public/_redirects` (`/*  /index.html  200`)
- **Vercel** - `vercel.json` rewrite (`/(.*)` -> `/index.html`)
- **GitHub Pages / Static Servers** - `vite.config.js` automatically clones `dist/index.html` to `dist/404.html` on `npm run build`
- **Nginx** - `try_files $uri $uri/ /index.html;`

Two further items wait on the deployment domain being known, both marked in
`index.html`: `og:url` with a `rel="canonical"` link, and an `og:image` (the
Open Graph spec requires an absolute URL, and there is no social-card asset yet).

## License

MIT