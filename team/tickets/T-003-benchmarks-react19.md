# T-003: align benchmarks/ to React 19

Lane: platform-engineer (build/tooling) or app-engineer
Branch: (unassigned - follow-up)
Status: OPEN (follow-up, not this session)
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
