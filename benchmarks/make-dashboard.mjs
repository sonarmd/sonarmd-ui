// Generate a self-contained visual dashboard (results/dashboard.html) from the
// benchmark JSON. Data is inlined so the file opens directly via file:// with no
// server and no dependencies. Pure HTML/CSS bars - zero chart libraries.

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const RESULTS = join(ROOT, 'results');

const read = (name) => (existsSync(join(RESULTS, name)) ? JSON.parse(readFileSync(join(RESULTS, name), 'utf8')) : null);

const runtime = read('runtime.json');
const components = read('components.json');
const shell = read('results.json');

const LIBS = ['sonarmd', 'mui', 'antd', 'bootstrap'];
const LABEL = {sonarmd: '@sonarmd/ui', mui: 'Material UI', antd: 'Ant Design', bootstrap: 'React Bootstrap'};
const COLOR = {sonarmd: '#2dd4bf', mui: '#a78bfa', antd: '#f87171', bootstrap: '#94a3b8'};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// One horizontal bar group for a single component row. values: {lib: number|null}.
// Bars are scaled to the row max so the shortest bar is the fastest/smallest.
const barRow = (name, sub, values, unit, lowerIsBetter = true) => {
  const present = LIBS.filter((l) => values[l] != null);
  const max = Math.max(...present.map((l) => values[l]));
  const best = present.reduce((b, l) => (values[l] < values[b] ? l : b), present[0]);
  const bars = LIBS.map((lib) => {
    const v = values[lib];
    if (v == null) {
      return `<div class="bar-line"><span class="bar-lib">${LABEL[lib]}</span><span class="bar-track"><span class="bar-na">n/a</span></span></div>`;
    }
    const pct = max > 0 ? Math.max(2, (v / max) * 100) : 2;
    const win = lib === best ? ' won' : '';
    return `<div class="bar-line"><span class="bar-lib">${LABEL[lib]}</span><span class="bar-track"><span class="bar-fill${win}" style="width:${pct.toFixed(1)}%;background:${COLOR[lib]}"></span><span class="bar-val">${v.toFixed(2)} ${unit}${lib === best ? ' &#9733;' : ''}</span></span></div>`;
  }).join('');
  return `<div class="row"><div class="row-head"><span class="row-name">${esc(name)}</span><span class="row-sub">${esc(sub)}</span><span class="row-win" style="color:${COLOR[best]}">fastest: ${LABEL[best]}</span></div>${bars}</div>`;
};

const sections = [];

// Headline win tally.
const tally = (rows, field) => {
  const w = Object.fromEntries(LIBS.map((l) => [l, 0]));
  for (const r of rows) {
    const present = LIBS.filter((l) => r.v[l] != null);
    if (!present.length) continue;
    const best = present.reduce((b, l) => (r.v[l] < r.v[b] ? l : b), present[0]);
    w[best] += 1;
  }
  return w;
};

// --- Runtime: mount + re-render ---
if (runtime) {
  const names = Object.keys(runtime.byLib.sonarmd.perComponent);
  const mountRows = names.map((n) => ({
    name: n,
    n: runtime.byLib.sonarmd.perComponent[n]?.count,
    v: Object.fromEntries(LIBS.map((l) => [l, runtime.byLib[l].perComponent[n]?.mountMedian ?? null])),
  }));
  const rerenderRows = names.map((n) => ({
    name: n,
    n: runtime.byLib.sonarmd.perComponent[n]?.count,
    v: Object.fromEntries(LIBS.map((l) => [l, runtime.byLib[l].perComponent[n]?.updateMedian ?? null])),
  }));

  const wMount = tally(mountRows, 'mount');
  const wRe = tally(rerenderRows, 're');

  sections.push(`<section><h2>Runtime - mount time <small>render N instances, median ms, lower is better</small></h2>
    <p class="tally">${LIBS.map((l) => `<b style="color:${COLOR[l]}">${LABEL[l]}: ${wMount[l]}</b>`).join(' &middot; ')} row wins</p>
    ${mountRows.map((r) => barRow(r.name, `N=${r.n}`, r.v, 'ms')).join('')}</section>`);

  sections.push(`<section><h2>Runtime - re-render time <small>re-render N instances after a prop change, median ms</small></h2>
    <p class="tally">${LIBS.map((l) => `<b style="color:${COLOR[l]}">${LABEL[l]}: ${wRe[l]}</b>`).join(' &middot; ')} row wins</p>
    ${rerenderRows.map((r) => barRow(r.name, `N=${r.n}`, r.v, 'ms')).join('')}</section>`);

  const bootRows = [
    {name: 'Cold boot', sub: 'parse + framework init', v: Object.fromEntries(LIBS.map((l) => [l, runtime.byLib[l].boot]))},
  ];
  sections.push(`<section><h2>Library boot <small>navigation start -> first commit, ms</small></h2>
    ${bootRows.map((r) => barRow(r.name, r.sub, r.v, 'ms')).join('')}</section>`);
}

// --- Bundle size per component ---
if (components) {
  const rows = components.rows.map((row) => ({
    name: row.name,
    v: Object.fromEntries(LIBS.map((l) => [l, row.cells[l] ? row.cells[l].total / 1024 : null])),
  }));
  const w = tally(rows, 'size');
  sections.push(`<section><h2>Bundle size per component <small>react + one component + CSS floor, total brotli kB</small></h2>
    <p class="tally">${LIBS.map((l) => `<b style="color:${COLOR[l]}">${LABEL[l]}: ${w[l]}</b>`).join(' &middot; ')} row wins (smallest)</p>
    ${rows.map((r) => barRow(r.name, '', r.v, 'kB')).join('')}</section>`);
}

// --- Whole shell total ---
if (shell) {
  const v = {};
  for (const r of shell.results) if (LIBS.includes(r.app)) v[r.app] = r.totalBr / 1024;
  sections.push(`<section><h2>Whole dashboard shell <small>full app: sidebar + KPIs + tabs + table + modal, total brotli kB</small></h2>
    ${barRow('Shell total', 'one real screen', v, 'kB')}</section>`);
}

const stamp = runtime?.stamp || components?.stamp || '';

const html = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>@sonarmd/ui benchmark dashboard</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #0b1020; color: #e5e7eb; font: 14px/1.5 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
  header { padding: 28px 32px 8px; border-bottom: 1px solid #1f2937; position: sticky; top: 0; background: #0b1020ee; backdrop-filter: blur(6px); }
  header h1 { margin: 0 0 4px; font-size: 22px; }
  header p { margin: 0; color: #9ca3af; font-size: 13px; }
  .legend { display: flex; gap: 16px; margin-top: 12px; flex-wrap: wrap; }
  .legend span { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #cbd5e1; }
  .swatch { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
  main { padding: 8px 32px 64px; max-width: 1100px; margin: 0 auto; }
  section { margin: 32px 0; }
  section h2 { font-size: 16px; margin: 0 0 4px; border-left: 3px solid #2dd4bf; padding-left: 10px; }
  section h2 small { color: #6b7280; font-weight: 400; font-size: 12px; margin-left: 8px; }
  .tally { margin: 6px 0 16px 13px; font-size: 12px; color: #94a3b8; }
  .tally b { font-weight: 600; }
  .row { margin: 0 0 18px; padding: 12px 14px; background: #111827; border: 1px solid #1f2937; border-radius: 10px; }
  .row-head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; }
  .row-name { font-weight: 600; font-size: 14px; }
  .row-sub { color: #6b7280; font-size: 12px; }
  .row-win { margin-left: auto; font-size: 12px; font-weight: 600; }
  .bar-line { display: flex; align-items: center; gap: 10px; margin: 3px 0; }
  .bar-lib { width: 120px; flex: none; font-size: 12px; color: #9ca3af; text-align: right; }
  .bar-track { position: relative; flex: 1; height: 20px; background: #0b1020; border-radius: 5px; display: flex; align-items: center; }
  .bar-fill { height: 100%; border-radius: 5px; opacity: 0.85; transition: width .4s ease; }
  .bar-fill.won { opacity: 1; box-shadow: 0 0 0 1px #ffffff44 inset; }
  .bar-val { position: absolute; left: 8px; font-size: 11px; color: #e5e7eb; text-shadow: 0 1px 2px #000a; white-space: nowrap; }
  .bar-na { padding-left: 8px; color: #4b5563; font-size: 11px; font-style: italic; }
</style>
</head>
<body>
<header>
  <h1>@sonarmd/ui benchmark dashboard</h1>
  <p>Shorter bar = faster / smaller. Star marks the winner of each row. Generated ${esc(stamp)}</p>
  <div class="legend">${LIBS.map((l) => `<span><i class="swatch" style="background:${COLOR[l]}"></i>${LABEL[l]}</span>`).join('')}</div>
</header>
<main>
${sections.join('\n')}
</main>
</body>
</html>
`;

const outFile = join(RESULTS, 'dashboard.html');
writeFileSync(outFile, html);
console.log(`Wrote ${outFile}`);
