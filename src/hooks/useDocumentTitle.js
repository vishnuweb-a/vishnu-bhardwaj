import { useLayoutEffect } from 'react';

// The site is a single document served under three routes, so the <title> in
// index.html is the only one the browser ever sees unless a route sets its own.
// That leaves a project page announcing itself as the home page: WCAG 2.4.2
// asks a page's title to describe its topic, and a screen reader reads the
// title first on every navigation. This is an accessibility requirement rather
// than observed reference behaviour, and is labelled as such (rule.md Rule 4).
//
// useLayoutEffect so the title is right before the browser paints the new
// route, and the previous title is restored on unmount so a back navigation
// never leaves a stale one behind.
export const useDocumentTitle = (title) => {
  useLayoutEffect(() => {
    if (!title) {
      return undefined;
    }

    const previous = document.title;
    document.title = title;

    return () => {
      document.title = previous;
    };
  }, [title]);
};

export default useDocumentTitle;
