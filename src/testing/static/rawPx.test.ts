/**
 * S3 Criterion 3.3: component CSS must not use raw px literals for
 * margin or padding. All spacing must come from semantic tokens via var().
 *
 * Allowed: padding: var(--smd-space-4)
 * Forbidden: padding: 16px
 *
 * Exceptions: zero values (0px, 0) are allowed as they carry no design intent.
 * Border widths (e.g. border: 1px solid) are excluded from this check since
 * they are component-chrome, not spacing rhythm.
 */
import {describe, it, expect} from 'vitest';
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';

const COMPONENTS_DIR = join(__dirname, '../../components');

function collectCssFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectCssFiles(full));
    } else if (entry.endsWith('.module.css') || entry.endsWith('.css')) {
      results.push(full);
    }
  }
  return results;
}

// Matches margin or padding properties with a raw px value (not inside var()).
// Catches: margin: 16px, padding: 8px 12px, margin-top: 4px, etc.
// Allows:  margin: 0 (no unit), margin: 0px (explicit zero), var(...) usage.
const RAW_PX_PATTERN =
  /^\s*(margin|padding)(-(?:top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?\s*:[^;]*(?<!\bvar\([^)]*)\b([1-9]\d*px)\b/;

describe('S3.3: no raw px in component margin/padding', () => {
  const files = collectCssFiles(COMPONENTS_DIR);

  it('should find CSS files to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  const violations: string[] = [];

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (RAW_PX_PATTERN.test(line)) {
        violations.push(`${file}:${idx + 1}: ${line.trim()}`);
      }
    });
  }

  it('no component CSS uses raw px for margin or padding', () => {
    expect(violations, violations.join('\n')).toHaveLength(0);
  });
});
