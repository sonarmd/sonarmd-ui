// Benchmark budget gate (CI release blocker). Reads results/results.json and
// budgets.json and exits non-zero if @sonarmd/ui regresses past budget or is no
// longer the smallest total. Run after `npm run measure`.

import {existsSync, readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const kb = (n) => `${(n / 1024).toFixed(2)} kB`;

const resultsPath = join(ROOT, 'results', 'results.json');
const budgetsPath = join(ROOT, 'budgets.json');

if (!existsSync(resultsPath)) {
  console.error('No results/results.json. Run `npm run measure` first.');
  process.exit(1);
}

const {results} = JSON.parse(readFileSync(resultsPath, 'utf8'));
const budgets = JSON.parse(readFileSync(budgetsPath, 'utf8'));
const sonar = results.find((r) => r.app === 'sonarmd');

const failures = [];

if (!sonar) {
  failures.push('no sonarmd result in results.json');
} else {
  const b = budgets.sonarmd;
  const checks = [
    ['JS (br)', sonar.js.br, b.jsBr],
    ['CSS (br)', sonar.css.br, b.cssBr],
    ['Total (br)', sonar.totalBr, b.totalBr],
  ];
  for (const [name, actual, limit] of checks) {
    const ok = actual <= limit;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: ${kb(actual)} / ${kb(limit)}`);
    if (!ok) failures.push(`${name} ${kb(actual)} over budget ${kb(limit)}`);
  }

  if (budgets.rules?.sonarmdMustBeSmallestTotal) {
    const smallest = results.reduce((a, r) => (r.totalBr < a.totalBr ? r : a), results[0]);
    const ok = smallest.app === 'sonarmd';
    console.log(
      `${ok ? 'PASS' : 'FAIL'}  smallest total: ${smallest.label} ${kb(smallest.totalBr)}`,
    );
    if (!ok) failures.push(`@sonarmd/ui is not the smallest total (${smallest.label} is)`);
  }
}

if (failures.length) {
  console.error(`\nBenchmark budget gate FAILED:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('\nBenchmark budget gate passed.');
