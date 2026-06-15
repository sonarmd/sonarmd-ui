import {resolve} from 'path';
import {defineConfig} from 'vite';
import type {Plugin} from 'vite';
import react from '@vitejs/plugin-react';
import {buildTokensCss} from './src/tokens/tokensCss';

// Serves the generated tokens as a <style> in dev (single source of truth, no
// build step, no dist) - replaces the old playground runtime-injection hack.
function devTokens(): Plugin {
  return {
    name: 'smd-dev-tokens',
    transformIndexHtml() {
      return [{tag: 'style', attrs: {id: 'smd-tokens'}, children: buildTokensCss(), injectTo: 'head'}];
    },
  };
}

// Dev workbench server: HMR straight against src/, no build, no dist.
export default defineConfig({
  root: resolve(__dirname, 'dev'),
  plugins: [react(), devTokens()],
  css: {
    modules: {generateScopedName: 'smd-[local]-[hash:5]'},
  },
  server: {open: true},
});
