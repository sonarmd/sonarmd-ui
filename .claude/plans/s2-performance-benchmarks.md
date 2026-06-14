# S2: Performance-first + benchmark infrastructure

Status: in-progress
Owner: Anthony (via Claude)
Spec: owner "S2 Directive" (see DECISIONS.md ADR-0001); supersedes V1_SPEC S2
Branch: feat/s2-performance (off feat/s1-packaging)

## Goal

Prove, with automated benchmarks, that a dashboard shell built from SonarMD UI
ships less JS and less CSS (and scores better on FCP/LCP/TBT/TTI) than the same
shell in Material UI, Ant Design, and React Bootstrap. Then drive architecture
(Sass CSS split, per-component exports, API convergence) by the numbers.

## Sequencing (benchmarks FIRST, per the directive)

### Phase 1 - Benchmark infrastructure (this increment)
- `benchmarks/` workspace. Shared "dashboard shell" spec implemented identically
  per library: sidebar, header, dashboard cards, form, table, modal, navigation.
- Apps: `benchmarks/apps/sonarmd`, `.../mui`, `.../antd`, `.../bootstrap`. Each a
  minimal Vite app rendering the shell.
- Harness `benchmarks/measure.mjs`: builds each app, computes JS transferred
  (gz+br), CSS transferred (gz+br), total bundle size; attempts runtime metrics
  (FCP/LCP/TBT/TTI, hydration) via Playwright when a browser is available, else
  records them as "n/a (no browser in env)".
- `benchmarks/results/` JSON + a generated `report.md` table.
- `benchmarks/budgets.json` + a check the CI can run; fail on SonarMD regression.

### Phase 2 - Make SonarMD win, by evidence
- Minimal `Button` + `Card` primitives (needed by the shell + the directive's
  core API; converge on variant/size/density/tone).
- Per-component subpath exports in package.json; tree-shaking boundary tests
  (importing Button must not reach Table/Modal/Charts/DataGrid).
- Reachability test: root must never reach echarts.

### Phase 3 - CSS architecture (Sass), driven by results
- `src/styles/` (tokens/reset/core/mixins/utilities) authored in Sass.
- Per-component `*.scss` -> per-component CSS output + shared `core.css` once.
- Reconcile with the S1 `buildTokensCss()` single source of truth.
- Migrate existing components CSS Modules -> Sass incrementally.

### Phase 4 - CI gates
- size budgets, CSS budgets, benchmark budgets, a11y tests, root-reachability,
  React 18/19 matrix.

## Environment notes
- npm installs use `--cache "$TMPDIR/npm-cache"` (root-owned ~/.npm EPERM).
- Headless-browser metrics may be unavailable in the sandbox; the harness must
  degrade to static size metrics and clearly label missing runtime numbers.

## Risks
- Sass migration of ~40 components is large; gated behind baseline evidence.
- Competitor app installs (MUI/AntD/Bootstrap) add heavy devDeps under
  benchmarks/ only - they must never enter the library's dependency graph.
- API convergence may touch many components; do it incrementally with snapshots.
