# Plan: per-component RUNTIME benchmark vs MUI / antd / React Bootstrap

## Goal
The bundle matrix proved @sonarmd/ui ships fewer bytes per component. Now prove
SPEED: every @sonarmd/ui component must out-render its competitor on mount time,
re-render time, first paint, and blocking time. Per-component, headless,
repeatable, median + p95 over N iterations.

## Approach
- Playwright (node package only; point executablePath at the already-cached
  chrome-headless-shell, PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 -> no download).
- One Vite app per library under apps-rt/<lib>/ exposing a component REGISTRY
  (name -> render one instance with realistic props) + a window.__bench timing
  API (promise-based mount(name,count) / update(), measured action -> post-commit
  rAF, i.e. render + layout time).
- Static-serve each built dist on localhost (tiny dependency-free node server).
- Harness measure-runtime.mjs: for each (lib, component) run R iterations of
  mount + update; capture FCP + TBT (longtask) on a fresh load. Median + p95.
- Winner per row = fastest median mount (report update + FCP too). Goal: sonarmd
  wins every row.

## Metrics (user-approved)
- Paint timing: FCP (and LCP where available).
- Mount + re-render: initial mount of N instances; update latency on prop change.
- Time to interactive (approx): total blocking time (sum of longtask>50ms) on load.

## Scope
- Components renderable inline as N instances (display + form + nav). Overlays
  (Modal/Drawer/Popover/Tooltip) measured as the always-present trigger render in
  this pass; interaction-latency mode is a possible follow-up (note it honestly).
- Same N per component across all libraries (fairness). Heavy components get a
  smaller N.

## Constraints
- Benchmark-only devDependency (playwright). Zero library deps touched.
- ASCII only. Signed commit. Sandbox disabled only for install + browser launch.
- Results: results/runtime.md + runtime.json.

## Status: done (honest result, NOT a clean sweep)
- Harness built: apps-rt/<lib> + _harness.tsx + measure-runtime.mjs. Playwright
  drives the cached chrome-headless-shell (no download). N=150-500, 25 runs.
- Measure switched from post-paint (frame-quantized, ~16.7 ms floor hid all
  differences) to render+commit+forced-layout in useLayoutEffect (sub-frame).
- RESULT (18 components):
  - vs Material UI and Ant Design: @sonarmd/ui wins 18/18 on BOTH mount and
    re-render, typically 3-10x faster.
  - vs React Bootstrap: genuine fight. Mount: Bootstrap 11, sonarmd 7. Re-render:
    sonarmd 10, Bootstrap 8. Bootstrap's bare-HTML primitives (Button/Badge/etc.)
    render a hair faster (sub-ms over 500 instances); sonarmd wins the richer /
    interactive components (Tabs, Tooltip, Breadcrumbs, Pagination re-render).
  - Boot: sonarmd fastest (15.5 ms) vs Bootstrap 18.3, MUI 29, antd 32.
- Did NOT game the benchmark to force a sweep. Beating Bootstrap on every bare
  primitive would mean shaving DOM nodes from accessible components - flagged to
  the user as a real-optimization decision, not done blindly.
