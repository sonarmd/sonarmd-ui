# T-003: align benchmarks/ to React 19

Lane: platform-engineer (build/tooling) or app-engineer
Branch: chore/benchmarks-react19 (merged, deleted)
Status: CLOSED (merged PR #11, f999c522)
Opened: 2026-06-16

## Problem

benchmarks/package.json still pins react@^18.3.1 / react-dom@^18.3.1 while the
library standardized on React 19 (one cohesive project). The benchmark harness is
an isolated sub-package (compares @sonarmd/ui bundle vs MUI/antd/bootstrap), so
this does NOT affect shipped artifacts - but it contradicts the cohesion goal.

## Scope (when picked up)

1. Bump benchmarks/package.json react + react-dom to ^19 (match root devDeps).
2. Refresh benchmarks/package-lock.json (npm install with --cache "$TMPDIR/npm-cache").
3. Re-run `npm run measure` + `npm run check` in benchmarks/; confirm budgets still
   pass and the comparison apps still build under React 19.
4. Watch the comparison libs (MUI 6, antd 5, react-bootstrap) for React 19 peer
   warnings; bump those if they block, otherwise leave.

## Decided

Human chose "spin a follow-up" (2026-06-16) over doing it inline. No shipped impact;
low priority. See team/DECISIONS.md D-20260616-benchmarks-react18-finding.

## Outcome (merged PR #11, f999c522)

react/react-dom bumped ^18.3.1 -> ^19; lockfile refreshed; results regenerated.
All 4 comparison apps build under React 19 with no lib bumps needed (no blocking
peer constraints from MUI/antd/react-bootstrap). Budgets still pass; @sonarmd/ui
keeps the smallest-total crown (73.05 kB br vs bootstrap 87.40, MUI 110.19, antd
253.68). React 19's larger runtime added ~12 kB uniformly across all libraries, so
the relative ranking held. Codex: clean pass, no findings. CI green. The cohesion
goal (one React version across the whole project) is now met. No shipped-artifact
impact (benchmarks is an isolated dev sub-package).
