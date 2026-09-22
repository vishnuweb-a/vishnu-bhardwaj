// Both routes share the main landmark and keyboard skip link.
export const MainLayout = ({ children }) => (
  <div className="min-h-[100dvh] bg-canvas">
    <a
      href="#main"
      className="sr-only rounded-full bg-pill text-on-pill focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:px-5"
    >
      Skip to content
    </a>
    <main id="main" tabIndex={-1}>
      {children}
    </main>
  </div>
);

export default MainLayout;
