import { useCallback, useEffect, useState } from 'react';
import { THEME_STORAGE_KEY, THEMES } from '@/utils/constants';

// Reads the class the inline bootstrap in index.html already applied, rather
// than re-deriving the theme. That script is the single source of truth for
// the first paint, so trusting it keeps the hook's first render in agreement
// with what is on screen and avoids a second, contradictory decision here.
const readAppliedTheme = () => {
  if (typeof document === 'undefined') {
    return THEMES.light;
  }
  return document.documentElement.classList.contains('dark')
    ? THEMES.dark
    : THEMES.light;
};

// localStorage throws rather than returning null under some privacy settings,
// so every access is guarded. Losing persistence is acceptable; losing the
// render is not.
const readStoredTheme = () => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === THEMES.dark || stored === THEMES.light ? stored : null;
  } catch {
    return null;
  }
};

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
 * Resolution order on a first visit: a stored choice, then the OS
 * `prefers-color-scheme`, then light. Once a visitor toggles, their choice is
 * stored and takes precedence over the OS from then on.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(readAppliedTheme);

  // Applying the class in an effect rather than in the toggle handler keeps
  // the DOM derived from state, so the two cannot drift apart.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === THEMES.dark);
    root.style.colorScheme = theme;
  }, [theme]);

  // A visitor who has not chosen explicitly keeps following the OS, including
  // a change made while the tab is open. A stored choice opts out of this.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event) => {
      if (readStoredTheme()) {
        return;
      }
      setTheme(event.matches ? THEMES.dark : THEMES.light);
    };

    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === THEMES.dark ? THEMES.light : THEMES.dark;
      storeTheme(next);

      // The transition rule is enabled only around the switch itself, so it
      // colours the theme change without slowing down every hover afterwards.
      // The timeout matches the 200ms in src/styles/index.css.
      const root = document.documentElement;
      root.classList.add('theme-transition');
      window.setTimeout(() => root.classList.remove('theme-transition'), 220);

      return next;
    });
  }, []);

  return { theme, isDark: theme === THEMES.dark, toggleTheme };
};

export default useTheme;
