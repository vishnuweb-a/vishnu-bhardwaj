import { useTheme } from '@/hooks';
import { Moon, Sun } from './icons';

// Sized and bordered to match the navbar's existing menu button exactly, so
// the two read as one control group rather than as a bolted-on switch.
//
// It is a plain toggle button rather than a switch: `aria-pressed` on a
// two-state control is understood more widely than role="switch", and the
// accessible name states the action and the current theme, so the icon is
// never the only indicator.
export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-control bg-surface-raised text-ink transition-colors hover:bg-surface active:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${className}`}
    >
      {isDark ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};

export default ThemeToggle;
