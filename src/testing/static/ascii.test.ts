/**
 * ASCII LAW: every source file under src/ and dev/ must contain only ASCII.
 *
 * Allowed bytes: tab (0x09), LF (0x0A), CR (0x0D), and printable ASCII in
 * the range 0x20-0x7E inclusive. Everything else is forbidden: smart quotes,
 * em/en dashes, ellipsis characters, box-drawing, arrows, bullets, emoji,
 * non-breaking spaces, zero-width characters, and BOM.
 *
 * This guards against typographic characters silently re-entering the
 * codebase. The failure message is ASCII-only and PHI-free: it reports the
 * offending file path, the first offending byte offset, and that byte's hex
 * value only - never the byte's rendered glyph or any file content.
 *
 * Build output (dist) and dependencies (node_modules) are not walked.
 */
import {describe, it, expect} from 'vitest';
import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import {join} from 'node:path';

const SRC_ROOT = join(__dirname, '../..');
const DEV_ROOT = join(__dirname, '../../../dev');

const SKIP_DIRS = new Set(['dist', 'node_modules']);

function collectSourceFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectSourceFiles(full));
    } else if (
      entry.endsWith('.ts') ||
      entry.endsWith('.tsx') ||
      entry.endsWith('.css')
    ) {
      results.push(full);
    }
  }
  return results;
}

function isAsciiByte(b: number): boolean {
  return b === 0x09 || b === 0x0a || b === 0x0d || (b >= 0x20 && b <= 0x7e);
}

function firstNonAscii(buf: Buffer): {offset: number; hex: string} | null {
  for (let i = 0; i < buf.length; i++) {
    const b = buf[i];
    if (!isAsciiByte(b)) {
      return {offset: i, hex: '0x' + b.toString(16).padStart(2, '0')};
    }
  }
  return null;
}

const roots = [SRC_ROOT, DEV_ROOT].filter((root) => existsSync(root));

describe('ASCII LAW: source files are ASCII only', () => {
  const files = roots.flatMap((root) => collectSourceFiles(root));

  it('should find source files to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  const violations: string[] = [];

  for (const file of files) {
    const found = firstNonAscii(readFileSync(file));
    if (found) {
      violations.push(`${file}: offset ${found.offset}: ${found.hex}`);
    }
  }

  it('no source file contains non-ASCII bytes', () => {
    expect(violations, violations.join('\n')).toHaveLength(0);
  });
});
