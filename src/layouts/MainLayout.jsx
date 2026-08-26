// The shell for both routes. There is no page-level header: the navbar lives
// inside the hero and scrolls away with it (design.md section 8), and the
// footer is part of the contact section (design.md section 14). What is left is
// the main landmark and a skip link, so keyboard users are not forced through
// the whole hero to reach the content.
//
// The skip link restates its box under the focus: variant because `not-sr-only`
// resets padding, width and height to their initial values. Without that the
// focused link rendered as a 78 x 26 block with the text flush against its edge
// [measured, Phase 4]; h-11 gives it the same 44px height as every other pill.
export const MainLayout = ({ children }) => (
  <div className="min-h-[100dvh] bg-canvas">
    <a
      href="#main"
      className="sr-only rounded-full bg-pill text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:px-5"
    >
      Skip to content
    </a>
    <main id="main">{children}</main>
  </div>
);

export default MainLayout;
