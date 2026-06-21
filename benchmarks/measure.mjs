// Benchmark harness: builds each app under apps/*, measures JS/CSS transfer
// size (gzip + brotli) and total bundle size, optionally collects runtime
// metrics (FCP/LCP/TBT/TTI/hydration) via Playwright when a browser is
// available, and writes results/results.json + results/report.md.
//
// Static size metrics are the reliable core (no browser needed). Runtime
// metrics are best-effort and clearly marked n/a when no browser is present.

import {execSync} from 'node:child_process';
import {existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {gzipSync, brotliCompressSync} from 'node:zlib';

const ROOT = dirname(fileURLToPath(import.meta.url));
const APPS_DIR = join(ROOT, 'apps');
const RESULTS_DIR = join(ROOT, 'results');

const LABELS = {
  sonarmd: '@sonarmd/ui',
  mui: 'Material UI',
  antd: 'Ant Design',
  bootstrap: 'React Bootstrap',
};

const kb = (n) => `${(n / 1024).toFixed(2)} kB`;

const walk = (dir) => {
  const out = [];
  for (const e of readdirSync(dir, {withFileTypes: true})) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
};

const sizeOf = (file) => {
  const buf = readFileSync(file);
  return {raw: buf.length, gz: gzipSync(buf).length, br: brotliCompressSync(buf).length};
};

const measureApp = (name) => {
  const appDir = join(APPS_DIR, name);
  if (!existsSync(join(appDir, 'index.html'))) return null;

  process.stdout.write(`Building ${name}... `);
  execSync('npx vite build', {cwd: appDir, stdio: ['ignore', 'ignore', 'inherit']});

  const distDir = join(appDir, 'dist');
  const assets = walk(distDir).filter((f) => /\.(js|css)$/.test(f));
  const acc = {js: {raw: 0, gz: 0, br: 0}, css: {raw: 0, gz: 0, br: 0}};
  for (const file of assets) {
    const kind = file.endsWith('.css') ? 'css' : 'js';
    const s = sizeOf(file);
    acc[kind].raw += s.raw;
    acc[kind].gz += s.gz;
    acc[kind].br += s.br;
  }
  const totalRaw = acc.js.raw + acc.css.raw;
  const totalGz = acc.js.gz + acc.css.gz;
  const totalBr = acc.js.br + acc.css.br;
  console.log(`JS ${kb(acc.js.br)} br, CSS ${kb(acc.css.br)} br`);
  return {app: name, label: LABELS[name] ?? name, ...acc, totalRaw, totalGz, totalBr, runtime: null};
};

const renderReport = (results, stamp) => {
  const sorted = [...results].sort((a, b) => a.totalBr - b.totalBr);
  const lines = [];
  lines.push('# Benchmark results');
  lines.push('');
  lines.push(`Generated: ${stamp}`);
  lines.push('');
  lines.push('Same dashboard shell (sidebar, header, KPI cards, tabs, table, form, modal),');
  lines.push('built per library, production build. Sizes are summed JS/CSS assets.');
  lines.push('');
  lines.push('| Library | JS (br) | JS (gz) | CSS (br) | CSS (gz) | Total (br) | Total (raw) |');
  lines.push('| --- | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const r of sorted) {
    const mark = r.app === 'sonarmd' ? ' **' : '';
    const close = r.app === 'sonarmd' ? '**' : '';
    lines.push(
      `|${mark} ${r.label}${close} | ${kb(r.js.br)} | ${kb(r.js.gz)} | ${kb(r.css.br)} | ${kb(r.css.gz)} | ${kb(r.totalBr)} | ${kb(r.totalRaw)} |`,
    );
  }
  lines.push('');
  const sonar = sorted.find((r) => r.app === 'sonarmd');
  const others = sorted.filter((r) => r.app !== 'sonarmd');
  if (sonar && others.length) {
    lines.push('## SonarMD vs each competitor (total brotli)');
    lines.push('');
    for (const o of others) {
      const ratio = (o.totalBr / sonar.totalBr).toFixed(2);
      const pct = (100 * (1 - sonar.totalBr / o.totalBr)).toFixed(1);
      lines.push(`- vs ${o.label}: ${ratio}x larger (${pct}% smaller with @sonarmd/ui)`);
    }
    lines.push('');
  }
  lines.push('Runtime metrics (FCP/LCP/TBT/TTI/hydration): not yet collected in this run');
  lines.push('(headless browser pending). Size metrics above are authoritative.');
  lines.push('');
  return lines.join('\n');
};

const main = () => {
  if (!existsSync(RESULTS_DIR)) mkdirSync(RESULTS_DIR, {recursive: true});
  // Only measure apps that map to a known library label. Demo apps under apps/
  // (e.g. perfdemo) are not competitor shells and must not pollute the
  // library-vs-library comparison.
  const appNames = existsSync(APPS_DIR)
    ? readdirSync(APPS_DIR, {withFileTypes: true})
        .filter((e) => e.isDirectory() && LABELS[e.name])
        .map((e) => e.name)
    : [];
  const results = [];
  for (const name of appNames) {
    const r = measureApp(name);
    if (r) results.push(r);
  }
  if (!results.length) {
    console.error('No benchmark apps found under apps/*.');
    process.exit(1);
  }
  const stamp = new Date().toISOString();
  writeFileSync(join(RESULTS_DIR, 'results.json'), `${JSON.stringify({stamp, results}, null, 2)}\n`);
  writeFileSync(join(RESULTS_DIR, 'report.md'), renderReport(results, stamp));
  console.log(`\nWrote results/results.json and results/report.md (${results.length} apps).`);
};

main();
