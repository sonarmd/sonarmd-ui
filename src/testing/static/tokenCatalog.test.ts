/**
 * Theming-guide catalog drift gate. The catalog (docs/stories/tokenCatalog.ts)
 * is a curated subset of the emitted tokens. Every token NAME it references must
 * be a `--smd-*` var that buildTokensCss actually emits; a catalogued name with
 * no matching var would render a dead swatch in the theming guide. This guards
 * that drift.
 *
 * Direction-1 only by design: catalogued names must exist in the token source,
 * but the source may emit many vars the catalog does not list (the catalog is a
 * deliberate ~24-of-127 subset), so this does NOT assert completeness.
 */
import {describe, it, expect} from 'vitest';
import {buildTokensCss} from '../../tokens/tokensCss';
import {TOKEN_GROUPS} from '../../../docs/stories/tokenCatalog';

const defined = new Set([...buildTokensCss().matchAll(/--smd-[a-z0-9-]+/g)].map((m) => m[0]));
const catalogued = TOKEN_GROUPS.flatMap((g) => g.tokens.map((t) => t.name));

describe('theming-guide token catalog', () => {
  it('was actually populated', () => {
    expect(TOKEN_GROUPS.length).toBeGreaterThan(0);
    expect(catalogued.length).toBeGreaterThan(0);
    expect(TOKEN_GROUPS.every((g) => g.tokens.length > 0)).toBe(true);
  });

  it('references only tokens the generator emits', () => {
    const missing = catalogued.filter((n) => !defined.has(n)).sort();
    expect(missing, missing.join(', ')).toEqual([]);
  });
});
