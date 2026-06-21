// Per-component RUNTIME benchmark. For every component, mount N instances and
// re-render them per library in a real (headless) browser and report mount time,
// re-render time, per-library boot time, and total blocking time. Smallest mount
// median wins the row.
//
// Each library has a Vite app under apps-rt/<lib> that exposes window.__bench
// (see apps-rt/_harness.tsx). This runner builds each app, static-serves the
// production build, drives the cached Playwright chrome-headless-shell, and runs
// WARMUP + RUNS iterations per component, reporting median and p95.
//
// A measured action resolves inside useLayoutEffect after a forced synchronous
// layout, so the numbers include React render + commit + style injection + layout
// (everything but async paint), identically per library. Sub-frame resolution.

import {execSync} from 'node:child_process';
import {createServer} from 'node:http';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, extname, join, normalize} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const ROOT = dirname(fileURLToPath(import.meta.url));
const APPS_DIR = join(ROOT, 'apps-rt');
const RESULTS_DIR = join(ROOT, 'results');

const LIBS = ['sonarmd', 'mui', 'antd', 'bootstrap'];
const LIB_LABELS = {
  sonarmd: '@sonarmd/ui',
  mui: 'Material UI',
  antd: 'Ant Design',
  bootstrap: 'React Bootstrap',
};

const EXECUTABLE =
  process.env.HOME +
  '/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell';

// Instances mounted per component (same for every library -> fair). Heavier
// components render fewer so a run stays in a sane wall-clock.
const COUNT = (name) =>
  ({Tabs: 150, Select: 200, Pagination: 200, Breadcrumbs: 300, Card: 300, Alert: 300, Tooltip: 300}[name] ?? 500);

const WARMUP = 8;
const RUNS = 25;

const MIME = {'.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.map': 'application/json'};

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const p95 = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.ceil(0.95 * s.length) - 1)];
};

const serve = (distDir) =>
  new Promise((resolve) => {
    const server = createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      const rel = urlPath === '/' ? '/index.html' : urlPath;
      const file = join(distDir, normalize(rel).replace(/^(\.\.[/\\])+/, ''));
      if (!existsSync(file)) {
        res.statusCode = 404;
        res.end('not found');
        return;
      }
      res.setHeader('Content-Type', MIME[extname(file)] || 'application/octet-stream');
      res.end(readFileSync(file));
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });

const measureLib = async (browser, lib) => {
  process.stdout.write(`Building ${lib}... `);
  execSync('npx vite build', {cwd: join(APPS_DIR, lib), stdio: ['ignore', 'ignore', 'ignore']});
  const server = await serve(join(APPS_DIR, lib, 'dist'));
  const {port} = server.address();
  const url = `http://127.0.0.1:${port}/`;

  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'load'});
  await page.waitForFunction(() => window.__bench && window.__bench.ready, null, {timeout: 15000});

  const boot = await page.evaluate(() => {
    const e = performance.getEntriesByName('bench-ready')[0];
    return e ? e.startTime : null;
  });
  const tbt = await page.evaluate(
    () =>
      new Promise((res) => {
        let total = 0;
        const po = new PerformanceObserver((list) => {
          for (const ent of list.getEntries()) total += Math.max(0, ent.duration - 50);
        });
        try {
          po.observe({type: 'longtask', buffered: true});
        } catch {
          res(0);
          return;
        }
        setTimeout(() => {
          po.disconnect();
          res(total);
        }, 60);
      }),
  );

  const names = await page.evaluate(() => window.__bench.names());
  const perComponent = {};
  for (const name of names) {
    const count = COUNT(name);
    const mounts = [];
    const updates = [];
    let errored = false;
    for (let r = 0; r < WARMUP + RUNS; r += 1) {
      await page.evaluate(() => window.__bench.clear());
      const m = await page.evaluate(([n, c]) => window.__bench.mount(n, c), [name, count]);
      const u1 = await page.evaluate(() => window.__bench.update());
      const u2 = await page.evaluate(() => window.__bench.update());
      const u3 = await page.evaluate(() => window.__bench.update());
      if (await page.evaluate(() => window.__benchError === true)) errored = true;
      if (r >= WARMUP) {
        mounts.push(m);
        updates.push(median([u1, u2, u3]));
      }
    }
    await page.evaluate(() => window.__bench.clear());
    perComponent[name] = errored
      ? null
      : {
          count,
          mountMedian: median(mounts),
          mountP95: p95(mounts),
          updateMedian: median(updates),
          updateP95: p95(updates),
        };
    process.stdout.write(perComponent[name] ? `${name} ${perComponent[name].mountMedian.toFixed(2)}ms  ` : `${name} ERR  `);
  }
  console.log('');

  await page.close();
  await new Promise((res) => server.close(res));
  return {boot, tbt, perComponent};
};

const main = async () => {
  if (!existsSync(RESULTS_DIR)) mkdirSync(RESULTS_DIR, {recursive: true});
  const browser = await chromium.launch({executablePath: EXECUTABLE});
  const byLib = {};
  for (const lib of LIBS) byLib[lib] = await measureLib(browser, lib);
  await browser.close();

  const stamp = new Date().toISOString();
  writeFileSync(join(RESULTS_DIR, 'runtime.json'), `${JSON.stringify({stamp, runs: RUNS, byLib}, null, 2)}\n`);
  writeFileSync(join(RESULTS_DIR, 'runtime.md'), renderReport({stamp, byLib}));
  console.log(`\nWrote results/runtime.json and results/runtime.md.`);
};

const ms = (n) => (n == null ? 'n/a' : `${n.toFixed(2)} ms`);

const renderReport = ({stamp, byLib}) => {
  const out = [];
  out.push('# Per-component runtime benchmark');
  out.push('');
  out.push(`Generated: ${stamp}`);
  out.push('');
  out.push('Headless Chromium (Playwright). For each component, N instances are mounted');
  out.push('and then re-rendered per library; each number is the median over');
  out.push(`${RUNS} measured iterations (after ${WARMUP} warmup). Timing is taken in`);
  out.push('useLayoutEffect after a forced synchronous layout, so render + commit +');
  out.push('style injection + layout are included (everything but async paint), at');
  out.push('sub-frame resolution. Lower is better; smallest mount median wins the row.');
  out.push('');

  out.push('## Library boot (cold load, no component)');
  out.push('');
  out.push('Boot = navigation start -> module evaluated + first commit (parse + framework');
  out.push('init). TBT = total blocking time (sum of longtask over 50 ms) during load.');
  out.push('');
  out.push('| Library | Boot | TBT |');
  out.push('| --- | ---: | ---: |');
  for (const lib of LIBS) out.push(`| ${LIB_LABELS[lib]} | ${ms(byLib[lib].boot)} | ${ms(byLib[lib].tbt)} |`);
  out.push('');

  // Union of component names, ordered by the sonarmd registry.
  const names = Object.keys(byLib.sonarmd.perComponent);

  const winner = (name, field) => {
    let best = null;
    for (const lib of LIBS) {
      const c = byLib[lib].perComponent[name];
      if (c && (best === null || c[field] < byLib[best].perComponent[name][field])) best = lib;
    }
    return best;
  };

  const renderTable = (title, field, intro) => {
    out.push(`## ${title}`);
    out.push('');
    out.push(intro);
    out.push('');
    out.push(`| Component | N | ${LIBS.map((l) => LIB_LABELS[l]).join(' | ')} | Winner |`);
    out.push(`| --- | ---: | ${LIBS.map(() => '---:').join(' | ')} | :--- |`);
    const wins = Object.fromEntries(LIBS.map((l) => [l, 0]));
    let counted = 0;
    for (const name of names) {
      const w = winner(name, field);
      if (w) {
        wins[w] += 1;
        counted += 1;
      }
      const n = byLib.sonarmd.perComponent[name]?.count ?? '';
      const cols = LIBS.map((lib) => {
        const c = byLib[lib].perComponent[name];
        if (!c) return 'n/a';
        const mark = lib === w ? '**' : '';
        return `${mark}${ms(c[field])}${mark}`;
      });
      out.push(`| ${name} | ${n} | ${cols.join(' | ')} | ${w ? LIB_LABELS[w] : '-'} |`);
    }
    out.push('');
    out.push(`Row wins (${counted} components): ${LIBS.map((l) => `${LIB_LABELS[l]} ${wins[l]}`).join(', ')}.`);
    out.push('');
  };

  renderTable('Mount time (median, N instances)', 'mountMedian', 'Time to render N fresh instances of the component.');
  renderTable(
    'Re-render time (median, N instances)',
    'updateMedian',
    'Time to re-render all N instances after a prop change.',
  );

  return out.join('\n');
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
