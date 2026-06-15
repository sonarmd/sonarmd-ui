import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // Stable (hashless) class names in tests so a hash bump never churns
      // snapshots (V1_SPEC 7.0.3). Production keeps the hashed names from
      // vite.config.ts.
      generateScopedName: 'smd-[local]',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
  },
});
