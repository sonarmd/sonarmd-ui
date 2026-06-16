# T-001: ASCII cleanup + enforcement guard

Lane: app-engineer
Branch: chore/ascii-cleanup
Status: CLOSED (merged PR #8, d843d10)
Opened: 2026-06-16

## Problem

Non-ASCII bytes remain in three tracked source files (ASCII LAW violation):
- `src/sonarmd-tokens.ts` - box-drawing (U+2500) comment dividers + em dashes (U+2014)
- `src/index.ts` - box-drawing (U+2500) comment dividers
- `src/components/Typeahead/index.tsx` - ellipsis (U+2026) in a rendered placeholder

There is no automated gate, so the rule is a habit, not enforced.

## Scope

1. Replace U+2500 -> '-', U+2014 -> '-' in the two .ts files (comments only).
2. Replace U+2026 -> '...' in Typeahead (rendered string; snapshot may need regen).
3. Add `src/testing/static/ascii.test.ts` - fails if any tracked
   src/** or dev/** .ts/.tsx/.css/.module.css file has a byte outside
   tab/LF/CR/0x20-0x7E.
4. Gate: typecheck, recipes typecheck, npm test (regen Typeahead snapshot if
   captured), build, size. ASCII sweep of changed files = 0 non-ASCII.

## PHI flow

None. Comment dividers + a search placeholder; no data path touched.

## Decisions

- R-20260616-4: The ASCII guard caught a fifth pre-existing violation,
  `src/components/Tabs/Tabs.module.css` (16x U+2500 box-drawing in comments),
  already on origin/main. Ruling: fix it in this branch. Rationale: the task is
  "repo is ASCII-clean + guard goes green"; a guard that fails defeats the purpose.
  Same mechanical s/U+2500/-/ fix. Scope was implicitly "all tracked source," and
  the guard is the authority on what counts. So: five files changed, not three.
