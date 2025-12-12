import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets are loaded correctly on GitHub Pages subdirectories
  define: {
    // Maps process.env.API_KEY to Vite's env variable for compatibility
    'process.env.API_KEY': 'import.meta.env.VITE_API_KEY'
  },
  build: {
    outDir: 'dist',
  }
});