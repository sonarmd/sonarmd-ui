import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// Production build for measurement: minified, no sourcemaps, hashed assets.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: false,
    reportCompressedSize: false,
  },
});
