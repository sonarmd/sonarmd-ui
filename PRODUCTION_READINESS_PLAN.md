# @sonarmd/ui, Production Readiness Plan

> Superseded in part by V1_SPEC.md, which is the delivery contract with acceptance criteria. This document remains the audit record and gap analysis.

Audit date: 2026-06-10. Current state: 42 components (33 UI + 9 ECharts charts), 3 hooks, tokens, 72 snapshot tests. Architecture is strong (forwardRef, memoization, focus traps, useSyncExternalStore form core, virtualized DataTable). What blocks production is packaging, theming delivery, and test depth, not component design.

## Blockers (library is broken or unusable for consumers without these)

### B1. CSS variables are never shipped
CSS modules consume 91 unique `--smd-*` variables. No `:root` block exists anywhere in `dist/`. The playground generates the variables at runtime from `sonarmd-tokens.ts` (`playground/main.tsx:26-45`), which means no real consumer can use the library today.

Fix: generate `tokens.css` at build time from `sonarmd-tokens.ts` (single source of truth, no drift). Prepend to `dist/style.css` or export as `@sonarmd/ui/tokens.css`. Add a build-time check that every `var(--smd-*)` referenced in CSS modules has a definition.

### B2. ECharts is bundled, not externalized
`dist/index.js` is 2.79 MB because `echarts` and `echarts-for-react` are missing from `rollupOptions.external` (`vite.config.ts:21`). Every consumer ships all of ECharts even for a Badge import.

Fix: move `echarts`/`echarts-for-react` to peerDependencies and externals. Then go further: replace `echarts-for-react` with a thin internal wrapper using `echarts/core` + modular imports (only LineChart, BarChart, PieChart, GaugeChart, FunnelChart, ScatterChart renderers needed). This is also the perf win the project demands, the wrapper controls init, resize (already ResizeObserver + throttle), and dispose directly.

### B3. No per-component tree shaking
Single-entry lib build means importing one component evaluates the whole library. No `sideEffects` field in package.json.

Fix: `preserveModules: true` in rollup output, add `"sideEffects": ["*.css"]`, keep the root barrel for DX. Result: `import {Badge} from '@sonarmd/ui'` costs only Badge.

### B4. Zero docs
No README, no usage examples, no prop documentation. "Drop the import and pass a handful of props" requires consumers to know the props.

Fix: README with install + theming setup, JSDoc on every exported prop interface (drives IDE intellisense, cheapest high-value docs), promote the playground to a docs site (Ladle or Storybook 8) with one story per component.

## Major (required for "100% prod ready", not blocking basic use)

### M1. Test depth
72 snapshot tests, but echarts and react-window are mocked, so chart option-building and virtualization logic have zero coverage. No interaction tests, no a11y assertions.

Plan, in order of risk:
1. Interaction tests (vitest + testing-library/user-event): Modal (trap, escape, focus restore), Dropdown/Typeahead/MultiSelect (keyboard nav, selection), DatePicker/DateRangePicker, Tabs, Toast lifecycle, useForm (validation, dirty state, submit).
2. Chart option tests: unmock echarts-for-react, assert generated option objects (series shape, token colors, formatters), fast, no canvas needed.
3. `vitest-axe` a11y pass on every component's default render, automated, catches regressions.
4. CI gate: typecheck + test + build + bundle-size budget (e.g. core bundle < 80 KB gz without charts) in GitHub Actions.

### M2. Hardcoded colors in charts
`GaugeChart` and `StackedBarChart` contain raw hex values instead of token references. Breaks single-source theming and future dark mode.

### M3. Chart UX completeness
Standardize across all 9 charts: loading state (skeleton, not spinner), empty state (EmptyState component reuse), error boundary, consistent tooltip/axis formatting from a shared chart theme object built from tokens. One shared `useChart` hook so each chart file is only its option builder.

### M4. Dark mode
Tokens are structured for it (primitive + semantic layers). Add a semantic dark map, emit `[data-theme="dark"]` block in generated tokens.css, add an ECharts dark theme from the same map. Defer if no near-term product need, but the token generation work in B1 should be built to support it.

## Minor

- `@types/react-window` is in `dependencies`; move to devDependencies.
- `files` includes `src/`, intentional? Drop unless needed for sourcemap resolution.
- Add `engines`/`packageManager` alignment (repo has both package-lock.json and yarn.lock, pick one).
- Version is 0.1.0 with no changelog: adopt changesets for versioning + release notes before first consumer adopts.
- React 19 in peer range untested, add a CI matrix job for React 18 and 19.

## Out of scope for this plan, flagged for the roadmap

React Native: project goal says React/RN, repo is web-only. RN parity is a separate workstream (separate package `@sonarmd/ui-native`, shared tokens package, charts via `@wuba/react-native-echarts` or victory-native). Decide after web library hits 1.0.

## Sequence

| Phase | Work | Outcome |
|-------|------|---------|
| 1 (now) | B1 tokens.css codegen, B2 externalize echarts, B3 preserveModules + sideEffects, M2 chart token fix | Library is installable and correct; bundle drops ~2.7 MB |
| 2 | B2b modular echarts/core wrapper, M3 shared chart theme + states, M1.2 chart option tests | Charts are fast, consistent, tested |
| 3 | M1.1 interaction tests, M1.3 axe pass, M1.4 CI gates | Regressions can't ship |
| 4 | B4 README + JSDoc + Ladle docs site, changesets, 1.0.0 | Adoptable by any team |
| 5 | M4 dark mode, RN decision | Platform expansion |

Definition of 100% prod ready: a fresh app can `npm i @sonarmd/ui`, import styles + tokens, drop any component in with props, and it renders correctly with full keyboard/screen-reader support; CI proves types, tests, a11y, and bundle budget on every PR; docs cover every component.
