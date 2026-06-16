# T-002: theming catalog drift-guard

Lane: app-engineer
Branch: chore/theming-catalog-guard
Status: CLOSED (merged PR #9, 2c40a12)
Opened: 2026-06-16

## Problem

docs/stories/theming.stories.tsx hand-maintains TOKEN_GROUPS (token name +
description). Nothing stops a catalogued token name from drifting away from the
token source (rename/removal -> a swatch that renders a dead CSS var). The story
even claims "Never hand-maintained" which is false for the names.

## Decision

D-20260616-theming-catalog-guard (see team/DECISIONS.md). Direction-1 guard only:
every TOKEN_GROUPS name must be emitted by buildTokensCss(). No completeness check
(127 emitted vs ~24 curated is by design). Extract TOKEN_GROUPS to a pure-data
module so the test imports real data.

## Scope

1. docs/stories/tokenCatalog.ts (NEW): export TokenGroup type + TOKEN_GROUPS,
   moved verbatim (descriptions intact), no React import.
2. docs/stories/theming.stories.tsx: import from ./tokenCatalog; fix the
   "Never hand-maintained" comment.
3. src/testing/static/tokenCatalog.test.ts (NEW): assert every catalogued name is
   in buildTokensCss() output; sanity assert non-empty groups.
4. Gate green + ASCII sweep.

## PHI flow

None.

## Decisions

- R-20260616-5: The guard caught a real pre-existing defect - 10 catalogued color
  names do not exist in the token source, so the theming guide has been rendering
  dead swatches. Fixing it IS the point of this ticket (a correct, guarded catalog).
  Verified against src/sonarmd-tokens.ts: text-link & border-focus = #393AF3 =
  primary-50 (so primary-50 is brand main); border-error = negative-30 (so -30 is
  the canonical vivid status step); scale is -10 lightest .. -60 darkest.
  Remap: success-500->positive-30, warning-500->warning-30, danger-500->negative-30,
  brand-500->primary-50, brand-600->primary-60, brand-100->primary-10,
  bg-muted->bg-raised (rewrite desc, raised!=muted).
  DROP (concept absent from system, do not invent): color-info-500, bg-inverse,
  border-subtle.
  Result: 5 files in this PR's diff (catalog data + story + new test), plus the
  catalog now references only real tokens; guard goes green.
