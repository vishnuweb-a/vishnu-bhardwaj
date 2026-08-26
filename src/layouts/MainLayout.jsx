// The shell for both routes. There is no page-level header: the navbar lives
// inside the hero and scrolls away with it (design.md section 8), and the
// footer is part of the contact section (design.md section 14). What is left is
// the main landmark and a skip link, so keyboard users are not forced through
// the whole hero to reach the content.
export const MainLayout = ({ children }) => (
  <div className="min-h-[100dvh] bg-canvas">
    <a
      href="#main"
      className="sr-only rounded-full bg-pill px-5 py-3 text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
    >
      Skip to content
    </a>
    <main id="main">{children}</main>
  </div>
);

export default MainLayout;
