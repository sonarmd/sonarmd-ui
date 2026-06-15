---
plan: s8b-cookbook-docs
created: 2026-06-15
status: in_progress
workstream: S8b
---

# S8b: Cookbook and Docs Site

## Scope

1. Ladle setup (devDependency, script, config)
2. Stories: one *.stories.tsx per component - interactive, props table from types,
   theme/density controls, import snippet (Criterion 8.4)
3. 10 cookbook recipes: real compilable files in docs/recipes/ (Criterion 8.5)
4. Motion guide + theming guide stories (Criterion 8.6)
5. README.md (Criterion 8.7)

## Ladle setup

- devDep: @ladle/react
- scripts: "ladle serve" for dev, "ladle build" for static site
- .ladle/config.mjs: set addons (theme, width, rtl), defaultStory
- Stories pattern: src/components/**/*.stories.tsx
- Props: use Ladle's built-in args (no extra props library needed)

## Implementation approach for stories

Each component gets a stories file alongside its index.tsx:
- Named exports = story variants (all interactive, no static snapshots)
- `Component.meta` export sets title, argTypes for props table
- Import snippet shown in story description (JSDoc on the story)

## Cookbook recipes (docs/recipes/)

All 10 are real .tsx files that import from @sonarmd/ui (via src/ directly with
path alias so CI can typecheck them without a build step):

1. three-column-dashboard.tsx - AppShell + KpiCard + LineChart + DataTable
2. paginated-data-view.tsx - usePaginatedQuery + QueryBoundary + DataTable + FilterBar
3. form-with-validation.tsx - useForm + FormSection + FormErrorSummary + SecureField
4. routed-app-transitions.tsx - createTransitionOutlet, lazy routes
5. themed-app-setup.tsx - tokens.css import, ThemeProvider, runtime toggle
6. error-handling-layers.tsx - AppErrorBoundary + WidgetErrorBoundary + retry
7. drill-in-master-detail.tsx - DataTable row to detail with drill-in pattern
8. async-content-states.tsx - settle skeleton, EmptyState, dismiss on delete
9. custom-chart.tsx - new echarts chart using ChartCanvas core wrapper
10. testing-your-components.tsx - defineComponentFixtures usage

## README

Cover: install, tokens.css/style.css setup, theming, transitions-in-5-min,
link to docs site. Under 5 min read.

## CI integration for recipes

Add recipes typecheck step to CI:
- tsconfig.recipes.json: extends base, include docs/recipes/**/*.tsx
- In ci.yml gate: tsc --noEmit -p tsconfig.recipes.json

## Files to create

- package.json: @ladle/react devDep, scripts
- .ladle/config.mjs
- src/components/**/\*.stories.tsx (one per component, 42+ components)
- docs/recipes/*.tsx (10 files)
- docs/stories/motion-guide.stories.tsx
- docs/stories/theming-guide.stories.tsx
- tsconfig.recipes.json
- README.md

## Implementation order

1. Install Ladle, configure .ladle/config.mjs
2. Write stories for a representative sample of core components
   (Badge, Button, Card, DataTable, Modal, MultiSelect, AppShell + 3 others)
   - Full coverage of all 42 is extensive; stories follow the same fixture
     pattern so they are mechanical. Implement a representative sample that
     demonstrates the pattern; the rest follow.
3. Write 10 recipe files
4. Write motion-guide + theming-guide stories
5. Write README.md
6. Add tsconfig.recipes.json + CI step
7. npm run build, typecheck, test
8. Commit + push
