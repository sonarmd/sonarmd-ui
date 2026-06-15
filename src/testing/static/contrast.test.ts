/**
 * Contrast gate (V1_SPEC Criterion 2.4): every semantic text/surface pair must
 * meet WCAG AA (4.5:1 for normal text) in both light and dark. Runs against the
 * actual token values, so a token edit that breaks contrast fails CI.
 */
import {test, expect} from 'vitest';
import {colors, colorsDark} from '../../sonarmd-tokens';

const channel = (c: number): number => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

const luminance = (hex: string): number => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`expected #rrggbb, got ${hex}`);
  const n = parseInt(m[1], 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};

const ratio = (a: string, b: string): number => {
  const la = luminance(a) + 0.05;
  const lb = luminance(b) + 0.05;
  return la > lb ? la / lb : lb / la;
};

const themeMap = (dark: boolean): Record<string, string> => ({
  ...colors,
  ...(dark ? colorsDark : {}),
});

// Normal-text pairs that must clear 4.5:1. (Disabled text is exempt per WCAG.)
const PAIRS: Array<[string, string]> = [
  ['text-primary', 'bg-base'],
  ['text-secondary', 'bg-base'],
  ['text-tertiary', 'bg-base'],
  ['text-tertiary', 'bg-subtle'],
  ['text-link', 'bg-base'],
  ['text-inverse', 'primary-50'],
];

for (const dark of [false, true]) {
  const label = dark ? 'dark' : 'light';
  const map = themeMap(dark);
  for (const [fg, bg] of PAIRS) {
    test(`${label}: ${fg} on ${bg} meets WCAG AA (4.5:1)`, () => {
      expect(ratio(map[fg], map[bg])).toBeGreaterThanOrEqual(4.5);
    });
  }
}
