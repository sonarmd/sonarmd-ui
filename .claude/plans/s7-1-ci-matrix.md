---
plan: s7-1-ci-matrix
created: 2026-06-15
status: in_progress
workstream: S7.1
---

# S7.1: CI Pipeline - React 18+19 Matrix

The existing ci.yml already covers: typecheck, tests (incl harness matrix, axe,
completeness checks, token check), build, size budgets, benchmark gate.

Missing: React 18 + React 19 matrix (S7.1 criterion).

## Approach

Add a second job `test-react-matrix` that:
- strategy.matrix: react-version: ['18', '19']
- npm ci
- npm install --no-save react@$version react-dom@$version (override without lock mutation)
- npm test (skip benchmarks - react-version-independent)

The main `gate` job stays unchanged. The matrix job runs in parallel.
Both must pass to merge (they appear as separate required checks).

## Change

Only file: .github/workflows/ci.yml

No new runtime deps, no structural changes to the workflow shape.
