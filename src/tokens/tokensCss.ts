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

/** The full `:root { ... }` block shipped as tokens.css. */
export function buildTokensCss(): string {
  const lines = [
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
    ...groupVars('sidebar', sidebar),
    ...groupVars('z', zIndex),
  ];
  return `:root {\n${lines.join('\n')}\n}\n`;
}
