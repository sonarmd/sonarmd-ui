import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the built app can be static-served from any path/port.
export default defineConfig({
  base: './',
  plugins: [react()],
  logLevel: 'silent',
  build: {outDir: 'dist', minify: 'esbuild', sourcemap: false, cssCodeSplit: false, reportCompressedSize: false},
});
