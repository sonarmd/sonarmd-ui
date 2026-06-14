# Architectural Decisions

Hard, long-lived decisions. Check here before reverting or modifying an existing
pattern. Newest on top.

---

## ADR-0001: S2 is a performance-first mandate (supersedes V1_SPEC S2 theming)

Date: 2026-06-14
Status: Accepted (owner directive)

### Context

The owner issued an "S2 Directive" that reorients the library around measurable
performance vs Material UI, Ant Design, and React Bootstrap (initial JS, FCP,
LCP, TBT, TTI, hydration, bundle size, CSS size). It replaces the theming-only
S2 in V1_SPEC.md and overrides several decisions previously locked in CLAUDE.md
and V1_SPEC.md. This ADR records the override so it is explicit, not silent.

### Decisions

1. **Benchmark-driven development.** Benchmark infrastructure is built first.
   No optimization claim is accepted without a measured comparison stored under
   `benchmarks/results/`. CI fails on regression beyond defined budgets.
   Benchmark apps implement the same dashboard shell (sidebar, header, cards,
   form, table, modal, navigation) in SonarMD UI, MUI, Ant Design, and React
   Bootstrap. (New.)

2. **CSS authoring moves to Sass.** Overrides the locked "CSS modules" decision.
   Sass is a source-management tool only - it must NOT emit one giant
   stylesheet. Authoring under `src/styles/` (tokens, reset, core, mixins,
   utilities) + per-component `*.scss`. Output: shared layers once
   (`dist/tokens.css`, `dist/reset.css`, `dist/core.css`) plus per-component
   files (`dist/button.css`, ...) and an aggregate `dist/styles.css`. Shared
   concerns (focus rings, typography, spacing/surface/elevation primitives, a11y
   utilities) exist exactly once in `core.css`; component CSS holds only
   component-specific rules. Migration of the ~40 existing CSS Module components
   follows the baseline benchmark (evidence-first, per the directive).

3. **No runtime theming.** Overrides V1_SPEC S2's "ThemeProvider + useTheme()".
   No ThemeProvider, no CSS-in-JS (Emotion/Styled Components), no runtime theme
   engine. Theming is `:root` / `[data-theme="light"|"dark"]` with semantic
   tokens; switching themes changes variables, not component CSS.

4. **Per-component subpath exports.** In addition to `.`, `./charts`, `./tokens`,
   every component is directly importable: `@sonarmd/ui/button`,
   `@sonarmd/ui/card`, `@sonarmd/ui/modal`, etc. Heavy features live behind
   subpaths only: `./charts`, `./data-grid`, `./icons`, `./advanced-table`. The
   root entry (`Button, Card, Badge, Input`, ...) never reaches charts, grids,
   icon packs, date libs, animation libs, modal infra, or dashboard code.
   Tree-shaking boundaries are enforced by tests that fail on violation.

5. **Component API convergence.** Components standardize on `variant`, `size`,
   `density`, `tone`, `state` rather than per-component prop explosions.

6. **CI performance gates (release-blocking).** Builds fail on: bundle-size
   budget regression, CSS budget regression, benchmark-score regression, the
   root package reaching chart/data-grid code, or accessibility failures. A11y
   (keyboard, visible focus, reduced motion, ARIA, WCAG AA) is a release gate.

### Consequences

- The `echarts` isolation from S1 stands and is now also enforced by an explicit
  "root must not reach echarts" reachability test.
- `tokens.css` codegen from S1 is reconciled with the Sass `tokens.scss` source
  (single source of truth preserved; see the S2 plan).
- Components are migrated CSS-Modules -> Sass incrementally, driven by benchmark
  evidence, to avoid a 40-file big-bang rewrite before measurement justifies it.
