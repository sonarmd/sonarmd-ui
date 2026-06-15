# S2 theming: dark mode + semantic layer (V1_SPEC S2)

Status: in-progress
Owner: Anthony (via Claude)
Spec: V1_SPEC S2 (remains in effect; performance track is additive per ADR-0001)
Branch: feat/s2-performance

## Why now
The performance track's next steps are gated (Sass blocked until CI green;
runtime metrics until a browser runs in CI). V1_SPEC sequences S2 theming after
S1, it is unblocked, and attribute-based theming adds zero runtime cost - fitting
the performance directive (no ThemeProvider required, no CSS-in-JS).

## Scope (this increment)
- Dark semantic map: add `colorsDark` (functional aliases only - text/bg/border;
  the primitive scale is shared) to `sonarmd-tokens.ts`.
- `buildTokensCss()` emits: `:root` (light), `[data-theme="dark"]` (dark), and
  `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` (dark
  follows OS when no attribute). All 40+ CSS components get dark mode with zero
  per-component work (criterion 2.3, components portion).
- Contrast gate `src/testing/static/contrast.test.ts`: WCAG AA over text/surface
  pairs in both themes (criterion 2.4).
- Fix hardcoded hex in GaugeChart + StackedBarChart -> reference token values
  (criterion 2.2 / audit M2).
- Lean `useTheme()` + minimal `ThemeProvider` (attribute toggle, negligible JS),
  exported; attribute-only usage works without them.

## Deferred (next theming increment)
- Chart dark re-theme (criterion 2.3 charts portion): an echarts theme object
  from the dark map applied without visible re-instantiation. The component
  (CSS) dark mode + chart hex fix land now; full echarts dark re-theme is the
  intricate follow-up.

## Verify
typecheck, tests (token completeness + new contrast gate), build (tokens.css has
dark block), size budgets, benchmark gate. Commit signed.
