import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { copyFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const spaFallbackPlugin = () => ({
  name: 'spa-fallback-plugin',
  closeBundle() {
    const indexHtml = resolve(__dirname, 'dist/index.html');
    const fallbackHtml = resolve(__dirname, 'dist/404.html');
    if (existsSync(indexHtml)) {
      copyFileSync(indexHtml, fallbackHtml);
    }
  },
});

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    spaFallbackPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // The object form left `vendor` empty, because the entry imports
        // react-dom/client rather than react-dom and the id never matched.
        // Resolving by module path keeps the three vendor chunks real.
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }
          if (id.includes('node_modules/animejs')) {
            return 'animation';
          }
          // Must precede the react test - react-router-dom would match it.
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'vendor';
          }
          return undefined;
        },
      },
    },
  },
});
