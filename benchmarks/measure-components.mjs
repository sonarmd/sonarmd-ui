// Per-component size benchmark. For every component in components.manifest.mjs,
// build a minimal production app that imports react + that ONE component (plus
// the library's CSS floor) for each of @sonarmd/ui, Material UI, Ant Design, and
// React Bootstrap, then measure total brotli (JS + CSS) shipped. The smallest
// total wins the row.
//
// total(component, lib) = react + react-dom + lib floor + that component's graph.
// marginal(component, lib) = total - baseline(lib), the cost of the component
// over the library's fixed floor (sonarmd/bootstrap carry a CSS file; mui/antd
// carry their CSS-in-JS runtime once a component is pulled).
//
// Static build only (esbuild minify, never executed), so JSX props need not be
// valid - they exist solely to keep the module graph from being tree-shaken.

import {execSync} from 'node:child_process';
import {existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {brotliCompressSync, gzipSync} from 'node:zlib';
import {COMPONENTS, CSS_FLOOR, LIBS, LIB_LABELS} from './components.manifest.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const TMP = join(ROOT, '.bench-tmp');
const RESULTS_DIR = join(ROOT, 'results');

const kb = (n) => `${(n / 1024).toFixed(2)} kB`;

const VITE_CONFIG = `import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  logLevel: 'silent',
  build: {outDir: 'dist', minify: 'esbuild', sourcemap: false, cssCodeSplit: false, reportCompressedSize: false},
});
`;

const INDEX_HTML = `<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8" /><title>bench</title></head>
  <body><div id="root"></div><script type="module" src="/main.tsx"></script></body>
</html>
`;

const mainSource = (cssLines, imp, jsx) =>
  `import {createRoot} from 'react-dom/client';
${cssLines.join('\n')}
${imp}
function App() {
  return (<div>${jsx}</div>);
}
createRoot(document.getElementById('root')).render(<App />);
`;

const walk = (dir) => {
  const out = [];
  for (const e of readdirSync(dir, {withFileTypes: true})) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
};

// Build the assembled app in the shared temp dir and return summed brotli bytes
// of JS + CSS, or null if the build fails (recorded as a gap, never fatal).
const buildAndMeasure = (mainTsx) => {
  const distDir = join(TMP, 'dist');
  if (existsSync(distDir)) rmSync(distDir, {recursive: true, force: true});
  writeFileSync(join(TMP, 'main.tsx'), mainTsx);
  try {
    execSync('npx vite build', {cwd: TMP, stdio: ['ignore', 'ignore', 'ignore']});
  } catch {
    return null;
  }
  let js = 0;
  let css = 0;
  for (const file of walk(distDir).filter((f) => /\.(js|css)$/.test(f))) {
    const buf = readFileSync(file);
    const br = brotliCompressSync(buf).length;
    if (file.endsWith('.css')) css += br;
    else js += br;
  }
  return {js, css, total: js + css};
};

const main = () => {
  if (existsSync(TMP)) rmSync(TMP, {recursive: true, force: true});
  mkdirSync(TMP, {recursive: true});
  writeFileSync(join(TMP, 'vite.config.ts'), VITE_CONFIG);
  writeFileSync(join(TMP, 'index.html'), INDEX_HTML);
  if (!existsSync(RESULTS_DIR)) mkdirSync(RESULTS_DIR, {recursive: true});

  // Per-library floor: react + react-dom + CSS floor, no component.
  const baseline = {};
  for (const lib of LIBS) {
    process.stdout.write(`Baseline ${lib}... `);
    const r = buildAndMeasure(mainSource(CSS_FLOOR[lib], '', 'baseline'));
    baseline[lib] = r;
    console.log(r ? `${kb(r.total)} br` : 'FAILED');
  }

  const rows = [];
  for (const comp of COMPONENTS) {
    process.stdout.write(`${comp.name}: `);
    const cells = {};
    for (const lib of LIBS) {
      const spec = comp.libs[lib];
      if (!spec) {
        cells[lib] = null;
        process.stdout.write(`${lib} n/a  `);
        continue;
      }
      const r = buildAndMeasure(mainSource(CSS_FLOOR[lib], spec.imp, spec.jsx));
      const marginal = r && baseline[lib] ? r.total - baseline[lib].total : null;
      cells[lib] = r ? {...r, marginal} : null;
      process.stdout.write(r ? `${lib} ${kb(r.total)}  ` : `${lib} ERR  `);
    }
    console.log('');
    rows.push({name: comp.name, cells});
  }

  rmSync(TMP, {recursive: true, force: true});

  const stamp = new Date().toISOString();
  writeFileSync(
    join(RESULTS_DIR, 'components.json'),
    `${JSON.stringify({stamp, baseline, rows}, null, 2)}\n`,
  );
  writeFileSync(join(RESULTS_DIR, 'components.md'), renderReport({stamp, baseline, rows}));
  console.log(`\nWrote results/components.json and results/components.md (${rows.length} components).`);
};

const winnerOf = (cells) => {
  let best = null;
  for (const lib of LIBS) {
    const c = cells[lib];
    if (c && (best === null || c.total < cells[best].total)) best = lib;
  }
  return best;
};

const renderReport = ({stamp, baseline, rows}) => {
  const out = [];
  out.push('# Per-component bundle benchmark');
  out.push('');
  out.push(`Generated: ${stamp}`);
  out.push('');
  out.push('Each cell is the total brotli (JS + CSS) of a production app that imports');
  out.push('react + react-dom + that ONE component, plus the library CSS floor');
  out.push('(@sonarmd/ui and React Bootstrap ship a CSS file; Material UI and Ant Design');
  out.push('ship CSS inside JS). Smallest total wins the row. Lower is better.');
  out.push('');

  // Floor table.
  out.push('## Library floor (react + react-dom + CSS floor, no component)');
  out.push('');
  out.push('| Library | Floor (br) |');
  out.push('| --- | ---: |');
  for (const lib of LIBS) {
    out.push(`| ${LIB_LABELS[lib]} | ${baseline[lib] ? kb(baseline[lib].total) : 'n/a'} |`);
  }
  out.push('');

  // Main table.
  out.push('## Total shipped per component (brotli, JS + CSS)');
  out.push('');
  out.push(`| Component | ${LIBS.map((l) => LIB_LABELS[l]).join(' | ')} | Winner |`);
  out.push(`| --- | ${LIBS.map(() => '---:').join(' | ')} | :--- |`);
  const wins = Object.fromEntries(LIBS.map((l) => [l, 0]));
  let counted = 0;
  for (const row of rows) {
    const winner = winnerOf(row.cells);
    if (winner) {
      wins[winner] += 1;
      counted += 1;
    }
    const cols = LIBS.map((lib) => {
      const c = row.cells[lib];
      if (!c) return 'n/a';
      const mark = lib === winner ? '**' : '';
      return `${mark}${kb(c.total)}${mark}`;
    });
    out.push(`| ${row.name} | ${cols.join(' | ')} | ${winner ? LIB_LABELS[winner] : '-'} |`);
  }
  out.push('');

  // Marginal table (cost over the library floor).
  out.push('## Marginal cost over library floor (brotli)');
  out.push('');
  out.push('The component-only delta: total minus the library floor above. Isolates the');
  out.push('per-component JS that tree-shaking actually adds.');
  out.push('');
  out.push(`| Component | ${LIBS.map((l) => LIB_LABELS[l]).join(' | ')} |`);
  out.push(`| --- | ${LIBS.map(() => '---:').join(' | ')} |`);
  for (const row of rows) {
    const cols = LIBS.map((lib) => {
      const c = row.cells[lib];
      return c && c.marginal != null ? kb(c.marginal) : 'n/a';
    });
    out.push(`| ${row.name} | ${cols.join(' | ')} |`);
  }
  out.push('');

  // Summary.
  out.push('## Summary');
  out.push('');
  out.push(`Components compared: ${counted}. Row wins (smallest total shipped):`);
  out.push('');
  for (const lib of LIBS) {
    out.push(`- ${LIB_LABELS[lib]}: ${wins[lib]}`);
  }
  out.push('');
  return out.join('\n');
};

main();
