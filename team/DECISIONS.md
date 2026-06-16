# Team decisions (append-only)

Architectural rulings. Reversal is a NEW entry with `Supersedes: <old-id>`.
This is the team-lead ledger; it complements the repo-root DECISIONS.md (ADRs for
code-level architecture).

---

## D-20260616-staging-na

PRs in this repo target `main` (squash-merge, org ruleset: signed + linear +
thread-resolution, 0 approvals). The team-lead skill's default "PRs target staging"
is overridden: the global directive forbids touching `staging`, and this library's
established workflow is merge-to-main. PHI flow: none in CI/branch coordination.

## D-20260616-sass-skip

Skip the deferred S2 Phase 5 Sass migration. CSS modules + semantic tokens deliver
the v1 styling contract; a Sass migration rewrites every *.module.css with no
behavior change and high regression surface. Decision: do not migrate absent a
concrete need (e.g. a feature CSS modules cannot express). SOC2/audit impact: none.
Supersedes nothing. Revisit requires a new entry.

## D-20260616-theming-catalog-guard

The theming-guide token catalog (docs/stories/theming.stories.tsx TOKEN_GROUPS) is
hand-maintained and can drift from the token source. Decision: DO NOT codegen the
catalog (it carries curated human descriptions worth keeping). Add a drift-guard
vitest suite mirroring src/testing/static/tokens.test.ts.

REFINED BY EVIDENCE (2026-06-16): buildTokensCss() emits 127 vars; TOKEN_GROUPS
catalogs ~24. The ~100 uncatalogued vars are intentional (full color scales 50-900,
z-index, input internals, shadows, type scale) - the catalog is a curated semantic
subset, not an exhaustive dump. Therefore the guard is DIRECTION-1 ONLY: assert
every name in TOKEN_GROUPS exists in buildTokensCss() output (catches a catalogued
token that was renamed/removed -> a dead swatch, the real drift). Do NOT enforce
completeness (every emitted var catalogued) - that invariant is false by design and
would either bloat the guide or require an unjustifiable ~100-entry allowlist.

Implementation: extract TOKEN_GROUPS + the TokenGroup type into a pure-data module
docs/stories/tokenCatalog.ts (no React import); the story imports from it; the test
imports the real data structure (not a regex over a .tsx). Correct the story's
misleading "Never hand-maintained" comment. PHI: none. Lane: app-engineer.

## D-20260616-realbrowser-benchmarks-defer

Real-browser perf metrics (FCP/LCP) for the benchmark harness require adding a
headless browser (Playwright) to CI. Decision: DEFER. Rationale: size-limit budgets
already gate the only perf property that affects consumers (shipped bytes); runtime
FCP/LCP is a measurement nicety, not a correctness gate, and adds CI surface +
runtime to a published library. Offered to the human as an optional approval; not
executed this sprint. Revisit if a perf-regression requirement emerges.

## D-20260616-benchmarks-react18-finding

FINDING (not yet a decision): benchmarks/package.json still pins react/react-dom
^18.3.1 while the library standardized on React 19 (one cohesive project). The
benchmark harness is an isolated sub-package (compares @sonarmd/ui bundle vs
MUI/antd/bootstrap), so this does not affect shipped artifacts, but it contradicts
the cohesion goal. Out of scope for the current 3-phase plan (no drive-by fixes).
Flagged for a follow-up ticket; not touched.
