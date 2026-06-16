# Plan: align benchmarks/ to React 19 (T-003)

Branch: chore/benchmarks-react19
Base: main (never staging)
Ticket: team/tickets/T-003-benchmarks-react19.md

## Problem

benchmarks/package.json pins react@^18.3.1 / react-dom@^18.3.1 while the library
standardized on React 19. Isolated sub-package (bundle-size comparison vs
MUI/antd/bootstrap), no shipped impact, but contradicts the one-cohesive-project
goal.

## Baseline (results/results.json, stamp 2026-06-15)

- sonarmd total br: 62049 (smallest); budget totalBr 100000, jsBr 90000, cssBr 16000
- bootstrap 77464, mui 100865, antd 247752
- All apps use createRoot from react-dom/client (React 19 compatible).

## Steps

1. Edit benchmarks/package.json: react ^18.3.1 -> ^19, react-dom ^18.3.1 -> ^19
   (match root devDeps exactly: both are "^19").
2. cd benchmarks && npm install --cache "$TMPDIR/npm-cache" to refresh lockfile.
3. cd benchmarks && npm run measure && npm run check.
   - Confirm all 4 apps build under React 19.
   - Confirm budgets pass and sonarmd is still smallest total.
4. Comparison libs (MUI 6, antd 5, react-bootstrap 2) may emit React 19 peer
   warnings. Bump ONLY if they block the build; otherwise leave.
5. ASCII check on all changed files (tr -cd filter).
6. Commit (signed, conventional), push branch.
7. Open ONE draft PR against main when green. Let Codex review; resolve threads
   before merge.

## Risks

- A comparison lib hard-fails to build under React 19 peer constraint -> bump that
  lib minimally (within same major if possible) and note it.
- size results shift slightly with React 19 runtime; budgets have headroom
  (sonarmd 62k vs 100k cap), so a small delta is fine. If sonarmd loses
  "smallest total" crown, investigate before proceeding.
- results/results.json + report.md will regenerate with new stamp; commit them.
