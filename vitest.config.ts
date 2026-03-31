import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: 'smd-[local]-[hash:5]',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
  },
});
