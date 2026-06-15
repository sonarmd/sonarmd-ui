# S7.0: declarative test harness (V1_SPEC S7.0)

Status: in-progress
Owner: Anthony (via Claude)
Spec: V1_SPEC S7.0; next in sequence after S0
Branch: feat/s2-performance

## Goal
A component's baseline suite is one declarative `*.fixtures.tsx`. The harness owns
rendering, providers, mocks, light/dark snapshots, and axe. Boilerplate appearing
twice is a defect.

## Pieces
- `src/testing/defineComponentFixtures.tsx`: `defineComponentFixtures(Component,
  {fixtures, router?, portal?, skipAxe?})`.
- `src/testing/harness.tsx`: render helpers (providers: MemoryRouter when router,
  data-theme for light/dark, portal container).
- `src/testing/fixtures.test.tsx`: the runner. import.meta.glob all
  `*.fixtures.tsx`; per named fixture generate a light snapshot, a dark snapshot,
  and a vitest-axe pass. Centralized mocks (ChartCanvas, react-window) live here
  once. A snapshot serializer normalizes hashed CSS-module class names
  (`smd-x-ab12c` -> `smd-x`) so a hash bump does not churn snapshots (7.0.3).
- `src/testing/static/fixtureCompleteness.test.ts`: every component under
  src/components has a `*.fixtures.tsx`; fail listing the missing ones (7.0.2).
- `@sonarmd/ui/testing` subpath (dev-only, excluded from size budgets) so
  consumers reuse the pattern (7.0.5).

## Migration
Convert components to fixtures incrementally; each conversion removes that
component from the monolithic `src/__tests__/snapshots.test.tsx`. When empty, the
monolith is deleted (7.0.2). Interaction tests stay in `*.test.tsx` and reuse the
harness entry (7.0.4).

## Increment 1 (this commit)
Harness core + serializer + vitest-axe + completeness check (warn until full
migration) + convert the Phase-0 primitives (Badge, Button, Card, IconButton,
Breadcrumbs) and remove them from the monolith.

## Verify
typecheck, tests (harness-generated light/dark + axe for converted components,
monolith for the rest), build, size budgets, benchmark gate.
