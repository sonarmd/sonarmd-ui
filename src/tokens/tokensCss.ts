/**
 * Generates the shipped tokens.css from sonarmd-tokens.ts. Single source of
 * truth: the build emits dist/tokens.css from buildTokensCss(), and the token
 * completeness test (src/testing/static/tokens.test.ts) checks against the same
 * function, so the generator and the check can never drift.
 *
 * Naming convention (mirrors how CSS modules consume the variables):
 *   - functional colors (text-/bg-/border-) -> bare `--smd-<key>`
 *   - all other colors                       -> `--smd-color-<key>`
 *   - every other group                      -> `--smd-<group>-<key>`
 */
import {
  colors,
  colorsDark,
  spacing,
  radius,
  shadows,
  fontSize,
  fontWeight,
  lineHeight,
  duration,
  ease,
  inputHeight,
  inputPaddingX,
  inputFontSize,
  inputIconInset,
  sidebar,
  zIndex,
} from '../sonarmd-tokens';

const FUNCTIONAL_COLOR_PREFIXES = ['text-', 'bg-', 'border-'];

/** camelCase -> kebab-case (only `widthCollapsed` needs it today). */
const kebab = (key: string): string => key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

const colorVars = (): string[] =>
  Object.entries(colors).map(([key, value]) => {
    const functional = FUNCTIONAL_COLOR_PREFIXES.some((p) => key.startsWith(p));
    return `  --smd-${functional ? '' : 'color-'}${key}: ${value};`;
  });

const groupVars = (prefix: string, group: Record<string, string | number>): string[] =>
  Object.entries(group).map(([key, value]) => `  --smd-${prefix}-${kebab(key)}: ${value};`);

// Dark overrides are all functional color aliases, so they are emitted bare
// (no `color-` prefix), matching how CSS modules consume them.
const darkVars = (): string[] =>
  Object.entries(colorsDark).map(([key, value]) => `  --smd-${key}: ${value};`);

/**
 * Central reduced-motion safety net (S4.4). WAAPI animations are neutralized in
 * the motion primitives; this covers CSS-keyframe and transition animations in
 * component modules so no surface translates, scales, or spins under
 * prefers-reduced-motion. Scoped to library classes (every CSS-module class is
 * `smd-` prefixed) so it never touches a consuming app's own animations. The
 * !important is the canonical reduced-motion reset - it must override keyframe
 * and inline durations - not a lint workaround.
 */
const REDUCED_MOTION_CSS = `@media (prefers-reduced-motion: reduce) {
  [class*="smd-"],
  [class*="smd-"]::before,
  [class*="smd-"]::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`;

/**
 * The shipped tokens.css: a light `:root`, a `[data-theme="dark"]` override
 * block, a prefers-color-scheme fallback so dark follows the OS when no theme
 * attribute is set (an explicit data-theme="light" still wins), and the central
 * reduced-motion reset.
 */
export function buildTokensCss(): string {
  const light = [
    ...colorVars(),
    ...groupVars('space', spacing),
    ...groupVars('radius', radius),
    ...groupVars('shadow', shadows),
    ...groupVars('font-size', fontSize),
    ...groupVars('font-weight', fontWeight),
    ...groupVars('line-height', lineHeight),
    ...groupVars('duration', duration),
    ...groupVars('ease', ease),
    ...groupVars('input-height', inputHeight),
    ...groupVars('input-px', inputPaddingX),
    ...groupVars('input-font', inputFontSize),
    ...groupVars('input-icon', inputIconInset),
    ...groupVars('sidebar', sidebar),
    ...groupVars('z', zIndex),
  ];
  const dark = darkVars();
  const darkIndented = dark.map((l) => `  ${l}`);
  return [
    `:root {\n${light.join('\n')}\n}`,
    `[data-theme="dark"] {\n${dark.join('\n')}\n}`,
    `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n${darkIndented.join('\n')}\n  }\n}`,
    REDUCED_MOTION_CSS,
    '',
  ].join('\n\n');
}
