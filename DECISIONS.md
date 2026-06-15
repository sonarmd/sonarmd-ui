# Architectural Decisions

Hard, long-lived decisions. Check here before reverting or modifying an existing
pattern. Newest on top.

---

## ADR-0003: The dev workbench is driven by *.fixtures.tsx, not separate zone files

Date: 2026-06-15
Status: Accepted

### Context

V1_SPEC S8a describes one `dev/zones/<Component>.tsx` per component. After S7.0,
every component already has a `*.fixtures.tsx` encoding its states.

### Decision

The dev workbench (`dev/Workbench.tsx`) auto-discovers and renders the existing
fixtures via `import.meta.glob`, instead of duplicating render code in ~55 zone
files. A new component appears in the workbench with zero registration, and there
is a single source of render states (DRY; CLAUDE.md anti-duplication).

### Consequences

- No `dev/zones/*.tsx`. The zone-completeness intent is satisfied by the
  fixture-completeness gate (every component has a fixtures file).
- The workbench and the test harness render components from the same definitions,
  so they can never drift.

---

## ADR-0002: CI-enforce benchmark + boundary gates before any Sass migration

Date: 2026-06-14
Status: Accepted (owner directive)

### Context

The performance proof to date is bundle-size oriented. Before optimizing CSS
authoring (Sass), the proof must become non-regressable, or a later change could
silently erode it.

### Decision

1. The benchmark budget check and the tree-shaking boundary tests are
   release-blocking CI gates. CI runs typecheck, tests (which include the
   boundary + token-completeness suites), build, size budgets, and the benchmark
   measure + budget check, and fails on any regression.
2. Benchmark artifacts (`benchmarks/results/report.md` + raw JSON) are committed
   to the repo and also uploaded by CI.
3. Runtime metrics (FCP/LCP/TBT/TTI/hydration) are attempted only when a headless
   browser (Playwright) is reliably available and MUST degrade cleanly; they are
   added after CI can run browser tests, not before.
4. **Do not begin the Sass migration until benchmark enforcement is committed
   and green.**

### Consequences

- `.github/workflows/ci.yml` is a self-contained quality gate (the precedented
  pattern for published-package repos in this org: see `agora`, `smeta`), not the
  `sonarmd/workflows` service orchestrator. `publish.yml` is untouched.

---

## ADR-0001: Performance-first benchmark track (injected into the plan, not a replacement)

Date: 2026-06-14
Status: Accepted (owner directive)

### Context

The owner issued a performance directive to make the library measurably faster
than Material UI, Ant Design, and React Bootstrap (initial JS, FCP, LCP, TBT,
TTI, hydration, bundle size, CSS size). Per owner clarification this is INJECTED
to close a gap - it does NOT replace V1_SPEC.md. The rest of the plan (S0
primitives, the S2 theming workstream, S3 layout, S4 motion, S5 transitions, S6
architectural, S7 verification, S8 docs) remains fully in effect and
authoritative. This ADR records the added performance constraints, and a few
items that adjust previously-locked choices, so they are explicit, not silent.

### Decisions

1. **Benchmark-driven development.** Benchmark infrastructure is built first. No
   optimization claim is accepted without a measured comparison stored under
   `benchmarks/results/`. Benchmark apps implement one dashboard shell (sidebar,
   header, cards, form, table, modal, navigation) in SonarMD UI, MUI, Ant Design,
   and React Bootstrap. (New, additive.)

2. **CSS authoring moves to Sass.** Adjusts the prior "CSS modules" default. Sass
   is a source-management tool only - it must NOT emit one giant stylesheet.
   Authoring under `src/styles/` (tokens, reset, core, mixins, utilities) +
   per-component `*.scss`. Output: shared layers once (`dist/core.css`, etc.) plus
   per-component files and an aggregate `dist/styles.css`. Shared concerns (focus
   rings, typography, spacing/surface/elevation primitives, a11y utilities) exist
   exactly once. Migration of existing CSS Module components is incremental and is
   gated behind committed+green CI benchmark enforcement (ADR-0002).

3. **Lean theming.** Performance stance: prefer attribute-based theming -
   `:root` / `[data-theme="light"|"dark"]` with semantic tokens; switching themes
   changes variables, not component CSS, and adds no JS. No CSS-in-JS
   (Emotion/Styled Components), no runtime theme engine. The V1_SPEC theming
   workstream still ships; if it exports a ThemeProvider it must be opt-in and add
   negligible JS, and attribute-only usage must work without it.

4. **Per-component subpath exports.** In addition to `.`, `./charts`, `./tokens`,
   every component is directly importable: `@sonarmd/ui/button`, etc. Heavy
   features live behind subpaths only: `./charts`, `./data-grid`, `./icons`,
   `./advanced-table`. The root entry never reaches charts, grids, icon packs,
   date libs, animation libs, modal infra, or dashboard code. Enforced by the
   tree-shaking boundary tests.

5. **Component API convergence.** Components standardize on `variant`, `size`,
   `density`, `tone`, `state` rather than per-component prop explosions.

6. **CI performance gates (release-blocking).** See ADR-0002.

### Consequences

- The `echarts` isolation from S1 stands and is enforced by a reachability test.
- `tokens.css` codegen from S1 is the single source of truth and is reconciled
  with the Sass `tokens` source when the Sass migration runs.
