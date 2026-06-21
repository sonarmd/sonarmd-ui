# @sonarmd/ui benchmarks

Proves @sonarmd/ui ships less JS and CSS than the same dashboard shell built with
Material UI, Ant Design, and React Bootstrap. Benchmark-driven development per
DECISIONS.md ADR-0001: no optimization claim is accepted without a measured
comparison here.

## Layout

```
benchmarks/
  shared/shellData.ts     shared, framework-agnostic dashboard data
  apps/
    sonarmd/              the shell built with @sonarmd/ui
    mui/                  the shell built with Material UI
    antd/                 the shell built with Ant Design
    bootstrap/            the shell built with React Bootstrap
  measure.mjs             build each app, measure JS/CSS transfer + bundle size
  budgets.json           CI budgets (fail on @sonarmd/ui regression)
  results/               results.json + report.md (generated)
```

Every app implements the identical screen: sidebar, header, KPI cards, tabs,
table, form, modal, navigation.

## Run

```
cd benchmarks
npm install              # uses file:.. for @sonarmd/ui (builds the library)
npm run measure          # whole-shell comparison -> results/report.md
npm run measure:components  # per-component comparison -> results/components.md
```

The library dependency graph never includes these competitor packages; they are
benchmark-only devDependencies under this folder.

## Per-component benchmark

`measure-components.mjs` answers a sharper question: for every component, how
many bytes does a page that uses ONLY that component ship, per library? It builds
a minimal production app (react + react-dom + one component + the library CSS
floor) for each of @sonarmd/ui, Material UI, Ant Design, and React Bootstrap and
measures total brotli (JS + CSS). The mapping lives in `components.manifest.mjs`;
`null` marks a library with no direct equivalent.

Two views are written to `results/components.md`:

- Total shipped per component (the headline; smallest total wins the row).
- Marginal cost over the library floor (isolates the per-component JS that
  tree-shaking adds, on top of each library's fixed floor).

The floor differs by CSS strategy: @sonarmd/ui and React Bootstrap ship a single
CSS file (paid once, amortized across every component used); Material UI and Ant
Design ship CSS inside JS (emotion / cssinjs runtime, pulled in with the first
component).

## Per-component runtime benchmark

`measure-runtime.mjs` measures SPEED, not size. Each library has a tiny Vite app
under `apps-rt/<lib>` exposing `window.__bench` (see `apps-rt/_harness.tsx`); the
runner builds it, static-serves the production build, drives the cached Playwright
chrome-headless-shell, and for every component mounts N instances and re-renders
them, reporting the median over many iterations. Timing is taken in
`useLayoutEffect` after a forced synchronous layout, so render + commit + style
injection + layout are included (everything but async paint) at sub-frame
resolution - measuring to paint would floor every fast render at one frame
(~16.7 ms) and hide real differences.

```
npm run measure:runtime   # -> results/runtime.md + runtime.json
```

Outputs: per-library boot + total blocking time, a mount-time matrix, and a
re-render-time matrix (smallest median wins each row). Playwright is a
benchmark-only devDependency and reuses the already-cached Chromium via an
explicit executablePath (no browser download).

## Metrics

- JS transferred (gzip + brotli)
- CSS transferred (gzip + brotli)
- Total bundle size
- Runtime (FCP/LCP/TBT/TTI/hydration) - added once a headless browser is wired

CI enforces `budgets.json`: @sonarmd/ui must stay under budget and remain the
smallest total in the run.
