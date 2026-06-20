/**
 * Every `styles.<name>` referenced in a component's TSX must be defined in that
 * component's CSS module. This catches a production-only defect the snapshot/axe
 * harness cannot: in vitest the scoped class name is generated for any accessed
 * key (`generateScopedName: 'smd-[local]'`), so a reference to a non-existent
 * class still yields a class in tests - but the real CSS-modules build only
 * exports classes that exist in the file, so the shipped element ends up
 * unclassed (and visually broken). This guard found DataTable's missing
 * `.trVirtual` (virtual rows) and Accordion's missing `.panel`.
 *
 * Only static `styles.identifier` access is checked; dynamic `styles[expr]`
 * (e.g. styles[size], styles[variant]) cannot be resolved statically and is
 * intentionally out of scope.
 */
import {describe, it, expect} from 'vitest';
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';

const COMPONENTS_DIR = join(__dirname, '../../components');

function definedClasses(css: string): Set<string> {
  const out = new Set<string>();
  for (const m of css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) out.add(m[1]);
  return out;
}

function referencedClasses(tsx: string): string[] {
  return [...tsx.matchAll(/\bstyles\.([a-zA-Z_]\w*)/g)].map((m) => m[1]);
}

function componentDirs(): string[] {
  return readdirSync(COMPONENTS_DIR)
    .map((name) => join(COMPONENTS_DIR, name))
    .filter((p) => statSync(p).isDirectory());
}

describe('component styles.* references resolve to a defined CSS class', () => {
  const violations: string[] = [];

  for (const dir of componentDirs()) {
    const files = readdirSync(dir);
    const cssFile = files.find((f) => f.endsWith('.module.css'));
    if (!cssFile) continue; // components without a CSS module (charts, etc.)
    const defined = definedClasses(readFileSync(join(dir, cssFile), 'utf-8'));

    for (const tsx of files.filter((f) => f.endsWith('.tsx') && !f.endsWith('.fixtures.tsx'))) {
      const content = readFileSync(join(dir, tsx), 'utf-8');
      if (!content.includes("from './")) continue;
      for (const ref of referencedClasses(content)) {
        if (!defined.has(ref)) violations.push(`${join(dir, tsx)}: styles.${ref} is not defined in ${cssFile}`);
      }
    }
  }

  it('finds component CSS modules to check', () => {
    expect(componentDirs().length).toBeGreaterThan(0);
  });

  it('has no undefined class references', () => {
    expect(violations, violations.join('\n')).toHaveLength(0);
  });
});
