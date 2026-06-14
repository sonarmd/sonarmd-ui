/**
 * Tree-shaking boundary gates (S2 directive). These follow the static import
 * graph from an entry module and fail if it can reach code that must stay
 * behind a subpath. If Button's graph ever reaches Modal/Table/charts, or the
 * root entry ever reaches echarts, a consumer importing the light surface would
 * pay for the heavy one - so this is a release gate, not a style check.
 */
import {existsSync, readFileSync, statSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {test, expect} from 'vitest';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const IMPORT_RE = /(?:import|export)\b[^'"]*?from\s*['"]([^'"]+)['"]/g;
const BARE_IMPORT_RE = /import\s*['"]([^'"]+)['"]/g;

const specifiers = (code: string): string[] => {
  const out: string[] = [];
  for (const m of code.matchAll(IMPORT_RE)) out.push(m[1]);
  for (const m of code.matchAll(BARE_IMPORT_RE)) out.push(m[1]);
  return out;
};

const resolveRelative = (importer: string, spec: string): string | null => {
  if (/\.(css|scss)$/.test(spec)) return null;
  const p = resolve(dirname(importer), spec);
  for (const c of [p, `${p}.ts`, `${p}.tsx`, join(p, 'index.ts'), join(p, 'index.tsx')]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
};

interface Graph {
  files: Set<string>;
  bare: Set<string>;
}

const collectGraph = (entry: string): Graph => {
  const files = new Set<string>();
  const bare = new Set<string>();
  const stack = [entry];
  while (stack.length) {
    const file = stack.pop()!;
    if (files.has(file)) continue;
    files.add(file);
    for (const spec of specifiers(readFileSync(file, 'utf8'))) {
      if (spec.startsWith('.')) {
        const resolved = resolveRelative(file, spec);
        if (resolved) stack.push(resolved);
      } else {
        bare.add(spec);
      }
    }
  }
  return {files, bare};
};

const reachesEcharts = (g: Graph): boolean => [...g.bare].some((b) => /^echarts(\/|$)/.test(b));
const reaches = (g: Graph, segment: string): boolean => [...g.files].some((f) => f.includes(segment));

test('root entry never reaches echarts', () => {
  const g = collectGraph(join(SRC, 'index.ts'));
  expect(reachesEcharts(g)).toBe(false);
  expect(reaches(g, `${join('charts', '')}`)).toBe(false);
});

test('importing Button does not pull Modal, Table, or charts', () => {
  const g = collectGraph(join(SRC, 'components', 'Button', 'index.tsx'));
  expect(reaches(g, join('components', 'Modal'))).toBe(false);
  expect(reaches(g, join('components', 'DataTable'))).toBe(false);
  expect(reaches(g, join('charts', ''))).toBe(false);
  expect(reachesEcharts(g)).toBe(false);
});

test('charts entry DOES reach echarts (detector is not vacuous; echarts is isolated there)', () => {
  const g = collectGraph(join(SRC, 'charts', 'index.ts'));
  expect(reachesEcharts(g)).toBe(true);
});
