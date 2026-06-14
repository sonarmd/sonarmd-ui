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
npm install          # uses file:.. for @sonarmd/ui (builds the library)
npm run measure      # builds each app, writes results/report.md
```

The library dependency graph never includes these competitor packages; they are
benchmark-only devDependencies under this folder.

## Metrics

- JS transferred (gzip + brotli)
- CSS transferred (gzip + brotli)
- Total bundle size
- Runtime (FCP/LCP/TBT/TTI/hydration) - added once a headless browser is wired

CI enforces `budgets.json`: @sonarmd/ui must stay under budget and remain the
smallest total in the run.
