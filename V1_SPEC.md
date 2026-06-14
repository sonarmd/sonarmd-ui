# Spec: @sonarmd/ui v1.0 delivery contract

**Status:** Ready
**Owner:** Anthony
**Design:** PRODUCTION_READINESS_PLAN.md (audit + sequencing)
**Decisions locked:** animations are zero-dep CSS + WAAPI; data layer is a custom zero-dep fetch core; transitions are a router-agnostic core with a thin react-router adapter.

## Context

The library has 42 architecturally solid components but is not consumable: CSS variables never ship, ECharts is bundled into a 2.79 MB entry, and there is no per-component tree shaking. v1.0 makes the library minimal, tree-shakeable, fully themed (light + dark), responsive, animated with a canonical motion language baked into the router layer, and ships a set of architectural components (error boundaries, data client) so a new app starts production-grade by default. Zero new runtime dependencies anywhere in this spec.

## Scope

In: packaging/tree-shaking, token pipeline + dark mode, layout/responsive system, motion system, page transitions, architectural components (`AppErrorBoundary`, `QueryBoundary`, `createApiClient` + hooks), CI gates, docs site.

Out: React Native (post-1.0 workstream), SSR frameworks beyond "does not crash" (no RSC streaming work), i18n/RTL (tracked for 1.1), visual regression screenshots (tracked for 1.1, axe + interaction tests cover v1).

Specs ship independently in this order. Each is a small, mergeable unit.

---

## S0. Missing primitives: Button, IconButton, Breadcrumbs

The contract: the design system has a real action vocabulary before anything is built on top of it.

### Criterion 0.1: Button
- Given `Button` with props `variant` (primary, secondary, ghost, danger), `size` (sm, md, lg), `loading`, `disabled`, `iconLeft`/`iconRight`, plus native button attributes via rest props and forwardRef
- When rendered in any variant/size/state combination in light and dark
- Then all colors, heights, paddings, radii, and focus rings come from semantic tokens, the loading state swaps the label for an inline spinner without width shift, and disabled+loading states are mutually correct (loading implies disabled)

### Criterion 0.2: IconButton
- Given `IconButton` with a required `label` prop
- When rendered
- Then `label` becomes `aria-label` and a Tooltip on hover/focus-visible; the component refuses to compile without it (required prop, no default)

### Criterion 0.3: Breadcrumbs
- Given `Breadcrumbs` with items (label + href or onClick) and router-agnostic link rendering (renderLink prop, react-router adapter provided)
- When rendered with more than 4 levels
- Then middle items collapse into an ellipsis Dropdown, nav landmark + aria-current are correct, and the last item is plain text

### Criterion 0.4: Adoption
- Given the existing suite
- When S0 merges
- Then FormActions, ConfirmDialog, Modal footers, FilterBar, and EmptyState render the new Button internally (one source of button styling, no visual regression beyond intentional token alignment), and existing public props remain backward compatible

## S1. Packaging, minimization, tree shaking

The contract: cost is proportional to what you import.

### Criterion 1.1: Per-component cost
- Given a fresh Vite app importing only `Badge` from `@sonarmd/ui`
- When the app is built for production
- Then the contributed JS is ≤ 3 KB gz and contains no chart, table, or form code

### Criterion 1.2: Charts are isolated and modular
- Given the chart components live in a `@sonarmd/ui/charts` subpath entry
- When a consumer imports `LineChart`
- Then echarts loads via `echarts/core` with only the required chart types, components, and the canvas renderer registered
- And `echarts-for-react` is no longer a dependency (internal wrapper owns init, ResizeObserver resize, theme, and dispose)
- And an app importing zero charts ships zero echarts bytes

### Criterion 1.3: Module preservation
- Given the build output
- When inspecting `dist/`
- Then output uses `preserveModules`, package.json declares `"sideEffects": ["**/*.css"]`, and `echarts` is a peerDependency

### Criterion 1.4: Budgets enforced
- Given CI runs on every PR
- When `size-limit` (or equivalent) executes
- Then budgets pass: single primitive ≤ 3 KB gz, full non-chart surface ≤ 80 KB gz, charts entry ≤ 120 KB gz including echarts core, motion + transitions + data entries ≤ 6 KB gz combined
- And any budget regression fails the build

Subpath entries after S1: `.` (core), `./charts`, `./motion`, `./transitions`, `./data`, `./tokens`, `./tokens.css`, `./style.css`.

---

## S2. Token pipeline, unified theme, dark + light

The contract: one token source, two complete themes, zero hardcoded values.

### Criterion 2.1: Tokens ship
- Given a fresh app importing `@sonarmd/ui/tokens.css` and `@sonarmd/ui/style.css`
- When any component renders
- Then every `var(--smd-*)` reference resolves (build step generates tokens.css from `sonarmd-tokens.ts`; a build-time check fails if any consumed variable lacks a definition)

### Criterion 2.2: Semantic layer
- Given the token files
- When a component or chart needs a color, space, radius, duration, easing, or type style
- Then it references a semantic token (`--smd-surface`, `--smd-text-secondary`, `--smd-space-4`), never a primitive hex or px literal
- And `grep` for 6-digit hex in `src/components` returns only the token definition files (GaugeChart and StackedBarChart violations fixed)

### Criterion 2.3: Dark mode
- Given `<html data-theme="dark">` (or `data-theme="light"`; absent attribute follows `prefers-color-scheme`)
- When any of the 42 components and 9 charts render
- Then every surface, border, text, focus ring, and chart series/axis/tooltip color comes from the dark semantic map
- And charts re-theme via an ECharts theme object generated from the same semantic map, with no chart re-instantiation visible to the user
- And toggling theme at runtime causes no flash of wrong theme (attribute swap only, no remount)

### Criterion 2.4: Contrast
- Given both themes
- When automated contrast checks run over every semantic text/surface pair
- Then all pairs meet WCAG AA (4.5:1 text, 3:1 large text and UI graphics) in light and dark

ThemeProvider + `useTheme()` exported for apps that want programmatic control; attribute-only usage works without the provider.

---

## S3. Layout and responsiveness, 3-column optimized

The contract: pages compose from layout primitives; the 3-column workspace is the first-class target.

### Criterion 3.1: Layout primitives
- Given new components `AppShell`, `Columns`, `Stack`, `Cluster`, `Spacer`
- When a consumer composes `AppShell` (sidebar + content + optional context rail)
- Then the 3-column workspace renders from props alone (column ratios, collapse priority) with no consumer CSS

### Criterion 3.2: Responsive collapse
- Given the 3-column layout
- When viewport or container width crosses the md breakpoint
- Then the context rail collapses first (to an overlay drawer), then the sidebar (to the existing Sidebar collapsed mode), content column never drops below its readable min-width
- And components adapt by container query where supported, viewport fallback otherwise

### Criterion 3.3: Spacing rhythm
- Given the spacing scale tokens (4px base, defined ramp)
- When any component or layout primitive spaces children
- Then only scale values are used; an ESLint rule (or stylelint) rejects raw px margins/paddings in component CSS

### Criterion 3.4: Density
- Given `data-density="compact"` on any container
- When form controls, table rows, and KpiCards render inside it
- Then heights and paddings step down one scale level consistently (3-column dashboards default to compact in docs guidance)

---

## S4. Motion system (zero-dep CSS + WAAPI)

The contract: one motion vocabulary, compositor-only, interruptible, accessible.

### Criterion 4.1: Motion tokens
- Given motion tokens (durations: instant 0, fast 120ms, base 200ms, slow 320ms, page 400ms; easings: standard, decelerate, accelerate, spring-out approximated by linear() curve)
- When any component animates
- Then it uses only these tokens; no ad-hoc duration or cubic-bezier literals in component CSS

### Criterion 4.2: Compositor only
- Given any animation shipped in the library
- When inspected
- Then it animates only `transform` and `opacity` (plus `clip-path` for the resolve pattern); no layout-triggering properties (width/height/top/left) except via FLIP measured transforms

### Criterion 4.3: Interruptible
- Given a running enter animation (e.g. user navigates back mid-transition)
- When the reverse action fires
- Then the animation reverses from its current position via WAAPI (`reverse()`/`cancel()` on the live `Animation` object), never restarting from a keyframe boundary or stacking a second animation

### Criterion 4.4: Reduced motion
- Given `prefers-reduced-motion: reduce`
- When any animation or page transition would play
- Then movement is replaced by a ≤ 120ms opacity crossfade; nothing translates, scales, or spins
- And this is implemented centrally in the motion primitives, not per call site

Exports from `@sonarmd/ui/motion`: `useAnimate` (WAAPI wrapper returning interrupt-safe controls), `usePresence` (mount/unmount with exit animations), `useFlip` (measured layout transitions), motion token constants.

---

## S5. Page transitions, baked into the router layer

The contract: an engineer wraps routes once; every navigation is animated correctly with zero per-page work.

Architecture: `@sonarmd/ui/transitions` holds the router-agnostic core (`TransitionContainer`, which takes a location key + direction and orchestrates exit/enter of children). A thin adapter, `createTransitionOutlet(reactRouter)`, derives direction from navigation type (PUSH = forward, POP = back) and route depth, and renders react-router's outlet inside the container. The core never imports react-router.

### Canonical pattern set (the complete v1 vocabulary, 8 patterns)

1. `nav-forward`: outgoing translates X -24px and fades to 0.9 opacity; incoming enters from X +32px with decelerate easing. Subtle parallax: outgoing moves at 0.75x incoming distance.
2. `nav-back`: exact mirror of nav-forward.
3. `resolve`: the loading state for async route content. A centered square indicator (rounded square, rotating border sweep) holds the canvas; when content resolves, the square expands via clip-path inset animation into the content container bounds while the indicator fades, content fades in with a 12px rise. This is the spinner-grows-into-page pattern, formalized.
4. `drill-in`: shared-element entry from a clicked card/row. Origin element FLIPs (scale + translate) into the detail page header region; rest of detail content fades in 40ms behind it.
5. `overlay`: modal/drawer entry. Scale 0.96 to 1 + fade for centered modals; translate + fade for side drawers; backdrop fades independently at fast duration.
6. `swap`: in-place content replacement (tab change, filter result). Outgoing fades, incoming fades in with 4px rise, base duration.
7. `settle`: skeleton-to-content. Skeleton crossfades to real content with a 30ms stagger cascade down the list/grid (max 6 staggered groups so total never exceeds slow duration).
8. `dismiss`: removal (toast leave, row delete, dialog close). Fade + 8px translate toward exit edge; for list rows, FLIP collapses remaining rows into place.

### Criterion 5.1: Zero per-page work
- Given an app using `createTransitionOutlet` once at its layout root
- When the user navigates forward, back, or to a lazy route that suspends
- Then nav-forward, nav-back, and resolve play respectively with no code on any page component

### Criterion 5.2: Direction correctness
- Given browser back/forward buttons, in-app links, and programmatic `navigate(-1)`
- When navigation occurs
- Then direction is derived correctly in all three cases (POP plays nav-back; PUSH to deeper route plays nav-forward)

### Criterion 5.3: Pattern opt-in per route
- Given a route configured with `transition: 'drill-in'` (route handle/meta)
- When navigation targets that route
- Then the named pattern overrides the default, and unknown names fall back to swap with a dev-mode console warning

### Criterion 5.4: No jank, no double-paint
- Given any canonical transition on a mid-tier device (4x CPU throttle in dev verification)
- When it plays
- Then no frame drops below 60fps target in the Performance trace (compositor-only), the outgoing page never flashes after the incoming page is interactive, and scroll position restores correctly on nav-back

### Criterion 5.5: Router-agnostic core proven
- Given the transitions test suite
- When `TransitionContainer` is driven by a fake history (no react-router in the test)
- Then all 8 patterns and interrupt/reverse behavior pass, proving the adapter boundary

### Criterion 5.6: Accessibility
- Given any page transition
- When it completes
- Then focus moves to the new page's main heading or designated focus target, a polite live region announces the page change, and reduced-motion users get the crossfade per 4.4

---

## S6. Architectural components

The contract: production app plumbing with clean DX, configured per project, never coupled to a specific API.

### `AppErrorBoundary` (from core entry)

### Criterion 6.1: Layered boundaries
- Given `AppErrorBoundary` at app root and `WidgetErrorBoundary` around any widget (chart, table, panel)
- When a widget throws during render
- Then only that widget shows its fallback (styled EmptyState variant with retry button); the rest of the page is unaffected; app-level fallback appears only for uncaught route-level errors

### Criterion 6.2: Reporting and recovery
- Given an `onError(error, info)` callback prop (Sentry-compatible signature) and `resetKeys`
- When the error reporter is configured and a resetKey changes (e.g. route change)
- Then the error is reported exactly once with component stack, and the boundary auto-resets
- And error messages rendered to the user never include the raw error message or stack (PHI-safe by default; opt-in `showDetail` for internal tools)

### `createApiClient` + hooks (from `@sonarmd/ui/data`)

Shape: `const api = createApiClient({ baseUrl, getHeaders, onUnauthorized, retry, fetch })` returns a typed client; hooks `useQuery`, `usePaginatedQuery`, `useMutation` consume it. ~4 KB gz total budget (within the S1 combined budget).

### Criterion 6.3: Query lifecycle
- Given `useQuery(['patients', id], () => api.get(...))`
- When the component mounts, remounts, or the key changes
- Then state progresses idle → loading → success/error; in-flight requests are deduped by key; requests abort via AbortController on unmount; a stale-while-revalidate refetch fires on remount within a configurable staleTime

### Criterion 6.4: Retry with backoff
- Given a request failing with a retryable status (408, 429, 5xx) or network error
- When the retry policy is `{ attempts: 3 }` (default)
- Then retries use exponential backoff with full jitter, honor `Retry-After` when present, never retry non-idempotent methods unless explicitly opted in, and surface the final error after exhaustion

### Criterion 6.5: Pagination
- Given `usePaginatedQuery` configured with either cursor or page/limit semantics
- When the consumer calls `fetchNext()`
- Then pages accumulate with stable identity (no full-list re-render of unchanged rows), `hasNext` derives from the configured extractor, and DataTable's virtualization consumes the result without adapter code

### Criterion 6.6: Boundary integration
- Given `QueryBoundary` wrapping content that uses these hooks
- When the query is loading, errored, or empty
- Then it renders the settle pattern skeleton, the WidgetErrorBoundary fallback with retry wired to refetch, or EmptyState respectively, all from props with no consumer conditionals

### Criterion 6.7: PHI-safe defaults
- Given any error or debug output from the data layer
- When a request fails
- Then logged/reported objects contain method, sanitized URL (path template, not values), status, and timing only; never headers, request bodies, or response bodies

---

## S7. Verification gates (acceptance criteria for the criteria)

### S7.0 Test harness: declarative, zero-boilerplate component testing

The contract: a component's entire baseline test suite is one declarative fixture file. The harness owns rendering, providers, mocks, snapshots, themes, and axe. Test boilerplate appearing twice anywhere is a defect.

Design: each component folder gets one `*.fixtures.tsx` exporting a `defineComponentFixtures(Component, config)` call. Config declares named fixtures (props per variant/state) and optional flags (`router: true`, `portal: true`, `skipAxe: ['rule']`). A single harness module (`src/testing/`) glob-discovers all fixture files and generates the full baseline matrix automatically. The current monolithic `snapshots.test.tsx` is deleted and replaced; its mocks (echarts, react-window) move into the harness as centralized, reusable mocks.

```ts
// src/components/Badge/Badge.fixtures.tsx (complete file, nothing else needed)
export default defineComponentFixtures(Badge, {
  fixtures: {
    default: {label: 'Active'},
    withTone: {label: 'Overdue', tone: 'negative'},
    withIcon: {label: 'Synced', icon: <CheckIcon />},
  },
});
```

### Criterion 7.0.1: One file per component, nothing else
- Given a newly added component with a fixture file of ≤ 25 lines
- When the test suite runs
- Then the harness auto-generates for every named fixture: a DOM snapshot in light theme, a DOM snapshot in dark theme, and a vitest-axe pass
- And no `render()`, provider wiring, mock setup, or `expect` boilerplate exists in any fixture file

### Criterion 7.0.2: Zero duplication, enforced
- Given the test codebase
- When reviewed or linted
- Then render/provider/mock logic exists exactly once (in `src/testing/`); fixture files contain only component-specific props and flags; any component lacking a fixture file fails a harness completeness check listing the missing components

### Criterion 7.0.3: Low-impact snapshots
- Given snapshot generation
- When a snapshot is written
- Then it is a serialized DOM tree with hashed CSS-module class names normalized to stable names (so a hash bump does not churn 42 snapshots), and portals/live-regions are serialized deterministically
- And an intentional visual change to one component touches only that component's snapshot files

### Criterion 7.0.4: Interaction tests extend, not escape, the harness
- Given a component needing behavioral tests (Modal, Dropdown, transitions)
- When interaction tests are written in `*.test.tsx` beside the fixtures
- Then they reuse the harness `renderFixture('default')` entry point for setup, adding only user-event steps and assertions

### Criterion 7.0.5: Consumers can reuse it
- Given the `@sonarmd/ui/testing` subpath export (dev-only, excluded from size budgets)
- When a consumer app imports `defineComponentFixtures` and the harness
- Then the same one-file pattern works for their own components built on this library

### S7.1 CI pipeline

- Given CI on every PR
- When the pipeline runs
- Then it executes: typecheck, the harness-generated baseline matrix (snapshots + axe, light and dark, per 7.0), interaction tests (Modal trap/escape/focus-restore, Dropdown/Typeahead/MultiSelect keyboard nav, DatePicker, Tabs, Toast lifecycle, useForm, all 8 transition patterns on fake history, data hooks against a mock fetch), chart option-builder tests (echarts unmocked, asserting option objects use semantic tokens), the harness completeness check, the tokens.css completeness check, and size-limit budgets
- And a React 18 + React 19 matrix passes
- And merge is blocked on any failure

## S8. Dev zone, cookbook, and docs site

The contract: one command to build components live, one site to learn everything, recipes you paste and ship.

### S8a. Dev zone (component workbench)

Today `npm run dev` is `vite build --watch` and the playground is one ad-hoc file (`playground/main.tsx`) with a runtime token-injection hack. Replace with a real workbench.

### Criterion 8.1: One-command live environment
- Given a fresh clone
- When the developer runs `npm run dev`
- Then a Vite dev server opens the workbench with HMR against `src/` directly (no build step, no dist), importing `tokens.css` properly (injection hack deleted, dies with S2)

### Criterion 8.2: Workbench structure mirrors the library
- Given `dev/` (replacing `playground/`) with `dev/index.tsx` as the entry
- When a developer builds a new component
- Then they add one `dev/zones/<Component>.tsx` file showing it in its states; the workbench sidebar auto-discovers zones via `import.meta.glob`, same zero-registration philosophy as the test harness
- And global chrome provides theme toggle (light/dark), density toggle, and viewport presets (sm/md/3-column desktop) applied to every zone

### Criterion 8.3: Workbench is dogfood
- Given the workbench chrome itself
- When inspected
- Then it is built from library components (AppShell, Sidebar, Tabs, Toggle), serving as a permanent integration test of the 3-column layout

### S8b. Cookbook and docs site

One deployed site, two halves: reference docs (per component) and a cookbook (per task). Built on Ladle, stories double as docs pages.

### Criterion 8.4: Reference coverage
- Given the docs site
- When a new engineer needs any of the 42+ components
- Then it has a live interactive story with theme/density controls, a props table generated from the TypeScript types (JSDoc on every exported prop interface, visible in IDE intellisense too), and a copy-paste import snippet

### Criterion 8.5: Cookbook recipes
- Given the cookbook section
- When an engineer has a task, not a component name
- Then a recipe exists as a complete, runnable, copy-paste composition with a live preview, covering at minimum:
  1. 3-column dashboard: AppShell + KpiGrid + LineChart + DataTable, compact density
  2. Paginated data view: usePaginatedQuery + QueryBoundary + DataTable + FilterBar
  3. Form with validation: useForm + FormSection + FormErrorSummary + SecureField (PHI input)
  4. Routed app with transitions: createTransitionOutlet, lazy routes, resolve + nav patterns
  5. Themed app setup: tokens.css, style.css, ThemeProvider, runtime toggle
  6. Error handling layers: AppErrorBoundary + WidgetErrorBoundary + retry wiring
  7. Drill-in master/detail: DataTable row to detail page with the drill-in pattern
  8. Async content states: settle skeleton, EmptyState, dismiss on delete
  9. Custom chart from the wrapper: new echarts chart type using the internal core wrapper + semantic theme
  10. Testing your app's components: defineComponentFixtures via @sonarmd/ui/testing
- And every recipe's code is type-checked in CI (recipes are real files compiled with the suite, never markdown-only snippets that rot)

### Criterion 8.6: Motion and theming guides
- Given the guides section
- When designing a new surface
- Then a motion page demos all 8 canonical patterns with do/don't guidance, and a theming page documents the semantic token catalog with light/dark swatches rendered from the actual tokens (never hand-maintained)

### Criterion 8.7: README
- Given the repo README
- When a consumer evaluates the library
- Then it covers install, tokens.css/style.css setup, theming, transitions-in-5-minutes, and links to the deployed site; total read under 5 minutes

## Dependencies and sequencing

S1 → S2 → S0 (needs tokens) → (S3, S4 in parallel) → S5 (needs S4) → S6 (needs S0 Button, S4 for settle integration) → S7 hardens throughout, gates 1.0 → S8b finishes last. Exception: S8a (dev zone) lands immediately after S2 so all later workstreams are built inside it, and S7.0 (test harness) lands with S2 so every subsequent component change ships with fixtures. Each S-spec is a separate PR series; no PR exceeds a reviewable day of work.

## Non-functional requirements

- Zero new runtime dependencies across all workstreams; echarts moves to peer.
- Tree-shaking verified by automated fixture app builds, not assumed from config.
- All animation work compositor-only; reduced-motion handled centrally.
- WCAG AA in both themes; keyboard-complete; focus management on every route change.
- PHI-safe defaults in error boundary and data layer (no bodies, no raw messages).
- No console output in production builds.

## Definition of done (v1.0)

- All S1 through S8 criteria pass with automated tests in CI.
- A fixture app demonstrates: install, 3-column AppShell, themed light/dark with runtime toggle, lazy routes with resolve + nav transitions, a paginated DataTable via usePaginatedQuery inside QueryBoundary, a thrown widget error contained by WidgetErrorBoundary.
- size-limit budgets green; changesets configured; 1.0.0 published to GitHub Packages.
- Docs site deployed; README complete.
