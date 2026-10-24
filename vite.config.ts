import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * PHASE 5 LOCKED VITE PRODUCTION CONFIGURATION
 * Optimized for 100% Free Static Hosting on Cloudflare Pages, GitHub Pages, or Netlify.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
