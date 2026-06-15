/**
 * Token completeness gate (V1_SPEC Criterion 2.1): every `var(--smd-*)` a CSS
 * module references must have a definition in the generated tokens.css. If a new
 * component uses a token that the generator does not emit, this fails with the
 * exact missing names rather than shipping a broken variable to consumers.
 */
import {readFileSync, readdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {test, expect} from 'vitest';
import {buildTokensCss} from '../../tokens/tokensCss';

const SRC_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const cssFiles = (dir: string): string[] => {
  const out: string[] = [];
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...cssFiles(full));
    else if (entry.name.endsWith('.css')) out.push(full);
  }
  return out;
};

const definedVars = (): Set<string> =>
  new Set([...buildTokensCss().matchAll(/--smd-[a-z0-9-]+/g)].map((m) => m[0]));

const consumedVars = (): Set<string> => {
  const consumed = new Set<string>();
  for (const file of cssFiles(SRC_DIR)) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(/var\((--smd-[a-z0-9-]+)/g)) consumed.add(m[1]);
  }
  return consumed;
};

test('every consumed --smd-* variable is defined in tokens.css', () => {
  const defined = definedVars();
  const missing = [...consumedVars()].filter((v) => !defined.has(v)).sort();
  expect(missing).toEqual([]);
});

test('CSS modules were actually scanned', () => {
  // Guards against a walk that silently finds nothing, which would make the
  // completeness check vacuously pass.
  expect(cssFiles(SRC_DIR).length).toBeGreaterThan(0);
  expect(consumedVars().size).toBeGreaterThan(0);
});
