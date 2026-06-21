# Plan: per-component benchmarks vs MUI / Ant Design / React Bootstrap

## Goal
The existing `benchmarks/` harness measures ONE dashboard shell per library and
compares total bundle size. The user wants per-component benchmarks: for every
@sonarmd/ui component, measure its marginal bundle cost and compare against the
equivalent component in Material UI, Ant Design, and React Bootstrap. "Beat them
all."

## Steps
1. Run the existing shell benchmark (`npm run measure`) to refresh
   results/report.md with current numbers. Confirm sonarmd is smallest total.
2. Build a per-component size harness:
   - A manifest mapping each component to its equivalent import in each library
     (sonarmd, mui, antd, bootstrap). Some have no equivalent -> mark n/a.
   - For each (library, component) build a tiny entry that imports ONLY that
     component + minimal render, vite build, measure brotli JS+CSS.
   - Subtract a per-library baseline (react+react-dom+lib runtime with no
     component) to get the MARGINAL cost of the component where meaningful;
     report both absolute and marginal.
3. Write results to results/components.json + results/components.md:
   per-component table, winner per row, and a summary (how many rows sonarmd wins).
4. Keep it in the existing harness style (plain node, zlib brotli, vite build).
   Zero new deps. ASCII only.

## Constraints
- Benchmark-only; never touches the library dependency graph.
- ASCII only. Signed commit. Draft PR only when 100% done.
- Do not modify library source for this task.

## Status: done
- Shell benchmark refreshed; perfdemo excluded from the library comparison
  (measure.mjs now only measures apps with a known library LABEL).
- Per-component harness built (components.manifest.mjs + measure-components.mjs),
  25 components x 4 libraries. Result: @sonarmd/ui wins 25/25 on total brotli.
- results/components.md + components.json written. npm run measure:components.
- All files ASCII-clean.
