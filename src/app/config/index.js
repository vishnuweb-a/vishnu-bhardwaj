export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'Portfolio',
  environment: import.meta.env.VITE_APP_ENV || 'development',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  enableAnimations: import.meta.env.VITE_ENABLE_ANIMATIONS === 'true',
};

export default appConfig;
