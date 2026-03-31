import {resolve} from 'path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // Prefix all generated class names to avoid collisions
      generateScopedName: 'smd-[local]-[hash:5]',
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SonarMDUI',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-router-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
          'react-router-dom': 'ReactRouterDOM',
        },
        // Keep CSS modules in a single extracted file
        assetFileNames: () => 'style.css',
      },
    },
    sourcemap: true,
    // Don't minify — consumers can do that themselves
    minify: false,
    cssCodeSplit: false,
  },
});
