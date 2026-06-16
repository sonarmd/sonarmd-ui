# Finish-out plan for @sonarmd/ui v1 (2026-06-16)

State: v1 is merged to `main` on React 19 (PRs #5/#6/#7). Gate green (typecheck 0,
263 tests, build, size). No open PRs. This plan clears what is left.

Standing workflow for every PR below (see memory [[codex-merge-loop]] / [[git-and-gh-ops]]):
branch off latest `main` -> change -> typecheck + recipes typecheck + `npm test`
+ build + size + ASCII sweep -> commit signed (sandbox disabled) -> push -> open PR
-> `@codex review` -> resolve every thread -> WAIT for Codex pass to fully land
(no `eyes`) -> CI green + 0 unresolved -> `gh pr merge N --squash`.

## Phase 1 - ASCII cleanup (the only real debt). One PR.
Branch `chore/ascii-cleanup`. Pure-comment/placeholder changes, low risk.
1. `src/sonarmd-tokens.ts`: 458 box-drawing `-` -> `-`; 7 em dash `-` -> `-`
   (all in comments). `perl -CSD -i -pe 's/\x{2500}/-/g; s/\x{2014}/-/g' <file>`.
2. `src/index.ts`: 189 box-drawing `-` -> `-` (comment dividers). Same perl.
3. `src/components/Typeahead/index.tsx`: 2 ellipsis `...` -> `...` (rendered
   placeholder 'Type to search...'). Same perl with `s/\x{2026}/.../g`.
4. Verify: ASCII sweep of changed files = 0 non-ASCII; `npm run typecheck` 0;
   `npm test` (regenerate the Typeahead snapshot if its placeholder is captured);
   build + size green.
5. Add a guard so this never regresses: a vitest static suite
   `src/testing/static/ascii.test.ts` that fails if any tracked `src/**` or
   `dev/**` `.ts`/`.tsx`/`.css` file contains a byte outside tab/LF/CR/0x20-0x7E.
   (This is the missing ASCII gate; it makes the rule enforced, not just a habit.)
6. PR -> Codex -> squash merge.

## Phase 2 - Housekeeping. No PR.
Delete the two merged branches once Phase 1 is in:
`git push origin --delete chore/react-19 fix/data-layer-stability` (and local `-D`).
Leave `main` as the single source of truth.

## Phase 3 - Deferred niceties (OPTIONAL - confirm before starting each).
These were explicitly deferred in IMPLEMENTATION_STATUS; none block v1. Listed with
effort so the call is informed:
- Theming-guide token catalog is hard-coded: generate it from the token source so
  it cannot drift. Small (one docs/build script + test). Lowest-risk of the three.
- Real-browser benchmark metrics (FCP/LCP/etc.): needs a headless browser in CI
  (Playwright). Medium; adds a CI dependency. Only if perf budgets must be measured
  in a real engine rather than jsdom.
- Sass migration (S2 Phase 5): large, touches every `*.module.css`; CSS-modules +
  tokens already deliver the v1 contract. Recommend NOT doing it unless there is a
  concrete need - flag for a human decision.

## Order
Phase 1 now -> Phase 2 -> stop and report. Phase 3 only on explicit go-ahead per item.
