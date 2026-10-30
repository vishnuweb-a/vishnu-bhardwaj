import { useCallback, useEffect, useRef, useState } from 'react';
import { THEME_STORAGE_KEY, THEMES } from '@/utils/constants';

// Reads the class the inline bootstrap in index.html already applied, rather
// than re-deriving the theme. That script is the single source of truth for
// the first paint, so trusting it keeps the hook's first render in agreement
// with what is on screen and avoids a second, contradictory decision here.
const readAppliedTheme = () => {
  if (typeof document === 'undefined') {
    return THEMES.dark;
  }
  return document.documentElement.classList.contains('dark')
    ? THEMES.dark
    : THEMES.light;
};

// localStorage throws rather than returning null under some privacy settings,
// so every access is guarded. Losing persistence is acceptable; losing the
// render is not.
const storeTheme = (theme) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* Persistence is best-effort; the session still switches correctly. */
  }
};

/**
 * Light/dark theme state, applied as a `dark` class on <html>.
 *
 * Dark is the site's designed default and is what a first visit gets,
 * whatever the OS `prefers-color-scheme` says. Toggling to light stores that
 * choice, which then wins on every later visit until it is toggled back.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(readAppliedTheme);
  // Set by the toggle handler, never by the updater, so the effect below can
  // tell an explicit choice from the initial mount. Without it the first visit
  // would persist the dark default as if the visitor had picked it.
  const toggledRef = useRef(false);

  // The DOM, storage and transition window are all derived from state here, so
  // the updater in toggleTheme stays pure (StrictMode double-invokes updaters).
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === THEMES.dark);
    root.style.colorScheme = theme;

    if (!toggledRef.current) {
      return undefined;
    }
    storeTheme(theme);

    // The transition rule is enabled only around the switch itself, so it
    // colours the theme change without slowing down every hover afterwards.
    // The timeout matches the 200ms in src/styles/index.css. Cleanup restarts
    // the window on a rapid second toggle and clears it on unmount.
    root.classList.add('theme-transition');
    const timer = window.setTimeout(
      () => root.classList.remove('theme-transition'),
      220
    );
    return () => {
      window.clearTimeout(timer);
      root.classList.remove('theme-transition');
    };
  }, [theme]);

  const toggleTheme = useCallback(() => {
    toggledRef.current = true;
    setTheme((current) =>
      current === THEMES.dark ? THEMES.light : THEMES.dark
    );
  }, []);

  return { theme, isDark: theme === THEMES.dark, toggleTheme };
};

export default useTheme;
