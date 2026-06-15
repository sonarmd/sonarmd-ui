import {resolve} from 'path';
import {defineConfig} from 'vite';
import type {Plugin} from 'vite';
import react from '@vitejs/plugin-react';
import {buildTokensCss} from './src/tokens/tokensCss';

/** Emits dist/tokens.css from the single token source on every build. */
function tokensCssPlugin(): Plugin {
  return {
    name: 'smd-tokens-css',
    generateBundle() {
      this.emitFile({type: 'asset', fileName: 'tokens.css', source: buildTokensCss()});
    },
  };
}

// react*, react-router-dom, react-window, and all echarts subpaths are peers.
const isExternal = (id: string): boolean =>
  /^react($|[-/])/.test(id) || /^echarts($|\/)/.test(id);

const sharedOutput = {
  preserveModules: true,
  preserveModulesRoot: 'src',
  assetFileNames: 'style.css',
} as const;

export default defineConfig({
  plugins: [react(), tokensCssPlugin()],
  css: {
    modules: {
      // Prefix all generated class names to avoid collisions
      generateScopedName: 'smd-[local]-[hash:5]',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Don't minify - consumers can do that themselves
    minify: false,
    // Single extracted stylesheet (style.css); tokens.css is emitted separately.
    cssCodeSplit: false,
    rollupOptions: {
      // Array input (not keyed) so preserveModules mirrors src/ paths exactly,
      // keeping each entry's .js aligned with the .d.ts tsc emits beside it.
      input: [
        resolve(__dirname, 'src/index.ts'),
        resolve(__dirname, 'src/charts/index.ts'),
        resolve(__dirname, 'src/sonarmd-tokens.ts'),
        resolve(__dirname, 'src/motion/index.ts'),
        resolve(__dirname, 'src/transitions/index.ts'),
      ],
      external: isExternal,
      preserveEntrySignatures: 'strict',
      output: [
        {format: 'es', dir: 'dist', entryFileNames: '[name].js', chunkFileNames: '[name].js', ...sharedOutput},
        {format: 'cjs', dir: 'dist', entryFileNames: '[name].cjs', chunkFileNames: '[name].cjs', exports: 'named', ...sharedOutput},
      ],
    },
  },
});
