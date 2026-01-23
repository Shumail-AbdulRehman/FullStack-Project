import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      visualizer({
<<<<<<< HEAD
        filename: 'bundle-stats.html', // output file
        open: true,                    // automatically open in browser
        gzipSize: true,                // show gzipped size
        brotliSize: true               // show brotli size
=======
        filename: 'bundle-stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true
>>>>>>> 4d1eafa (impoved frontend UI)
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
