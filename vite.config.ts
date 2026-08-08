import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        /**
         * Split the framework out of the application chunk.
         * React changes on a release cadence; our copy changes weekly. Keeping
         * them apart means a copy tweak does not invalidate the vendor bundle in
         * every returning visitor's cache. Matching on the resolved path rather
         * than a package-name array is what catches `react-dom/client` and the
         * scheduler, which a plain `['react','react-dom']` list misses.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
          return 'vendor';
        },
      },
    },
  },
});
