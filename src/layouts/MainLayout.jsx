import { BytePet } from '@/features/byte';

// Both routes share the main landmark and keyboard skip link.
//
// The wrapper carries no background of its own: `body` already paints the
// canvas, and an opaque surface here would cover the dark theme's grid.
export const MainLayout = ({ children }) => (
  <div className="min-h-[100dvh]">
    <a
      href="#main"
      className="sr-only rounded-full bg-pill text-on-pill focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:px-5"
    >
      Skip to content
    </a>
    <main id="main" tabIndex={-1}>
      {children}
    </main>
    {/* Mounted here rather than in App so BYTE is shared by every route and
        outlives navigation between them, but still sits outside <main> - it is
        a companion overlay, not page content. It is last in the DOM so its
        focusable body comes after the page's own content in tab order. */}
    <BytePet />
  </div>
);

export default MainLayout;
