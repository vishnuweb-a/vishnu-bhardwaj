export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Portfolio';
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';
export const ENABLE_ANIMATIONS =
  import.meta.env.VITE_ENABLE_ANIMATIONS === 'true';

export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const ANIMATION_DURATIONS = {
  fast: 300,
  base: 600,
  slow: 1000,
};
