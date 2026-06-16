# team-lead status

Cross-domain decision authority for @sonarmd/ui. Reads, reviews, rules, routes.
Does not write code in any lane.

## Rulings carried (sprint log)

- R-20260616-1: Branch naming for library work follows the repo's conventional
  prefixes (feat/ fix/ chore/), NOT the generic <role>/<topic> template, because
  the repo's merged history (#1-#7) is uniformly conventional and consistency wins.
  team/SHARED_LOCK.md still records the owning lane.
- R-20260616-2: This repo merges to `main` (squash) via the org ruleset, NOT to
  `staging`. The team-lead skill's generic "PRs target staging" does NOT apply
  here; the global directive forbids touching `staging` entirely. PRs target main.
- R-20260616-3 (Phase 3 / Sass): SKIP the S2 Phase 5 Sass migration. CSS modules +
  semantic tokens already satisfy the v1 contract; migration touches every
  *.module.css for zero behavior gain and is large blast radius. Revisit only on a
  concrete need (recorded in team/DECISIONS.md).

## Phase 2 outcome (2026-06-16)

Executed (plan-authorized): deleted remote+local `chore/react-19` (PR#7) and
`fix/data-layer-stability` (PR#6). chore/ascii-cleanup auto-deleted by PR#8 merge.

Remaining (batched for human, NOT auto-deleted - scope/gating discipline):
- Remote PR-merged, safe to delete on approval: chore/publish-node22-arm (#2),
  feat/forms-foundation (#3), feat/s1-packaging (#4), feat/s2-performance (#5).
- Local-only (no remote): code-agent/add-prepare-script (#1 merged),
  code-agent/ci-align-arm-node22 (no PR). Cheap/recoverable; left untouched.
- parked/chore-publish-node22-arm-20260607-213147: deliberately parked -> KEEP.

## Phase 3a outcome (in flight)

theming-catalog drift-guard. Guard caught 10 dead catalogued color names (guide was
rendering dead swatches) - ruled remap (R-20260616-5), verified vs sonarmd-tokens.ts.
Committed signed (def230e), pushed, DRAFT PR #9 open, Codex triggered. Gate green
(267 tests, guard 2/2, typecheck, recipes, build, size).

## Active routing

- Phase 1 ASCII cleanup -> app-engineer lane (chore/ascii-cleanup).
- Phase 2 branch housekeeping -> team-lead (git coordination).
- Phase 3 niceties -> ruling above; theming-catalog -> app-engineer; benchmarks -> evaluate.

## Pending human approvals (batched)

(none - all resolved 2026-06-16)

## Resolved human decisions (2026-06-16)

1. Remote branch deletes (4 PR-merged remotes) - human ruled KEEP. No deletions.
   chore/publish-node22-arm, feat/forms-foundation, feat/s1-packaging,
   feat/s2-performance remain on the remote by choice.
2. benchmarks/ React 18 -> 19 - human ruled SPIN A FOLLOW-UP (not this session).
   Tracked as T-003.
3. team/ governance dir + plan file - human ruled COMMIT TO REPO. Done via PR.
4. Real-browser benchmarks - team-lead ruling stands: DEFER
   (D-20260616-realbrowser-benchmarks-defer); not raised against the human, no
   objection. Sass migration - DEFER/skip (D-20260616-sass-skip).

## Running notes

- 2026-06-16 session start: fresh team/ adoption. main green (typecheck 0, 263
  tests, build, size). No open PRs. 7 prior PRs all merged. Branches stale.
- chore/react-19 is tree-identical to main (0 diff) -> provably safe to delete.
- Phase 1: app-engineer made edits (5 files: 3 .ts comment dividers, Tabs.module.css,
  Typeahead placeholder) + new ascii.test.ts guard. Guard caught a 5th pre-existing
  violation (Tabs.module.css) - ruled in-scope (R-20260616-4), fixed. Gate green
  (typecheck 0, recipes 0, 265 tests, build, size). Committed signed (4db20d5),
  pushed, opened DRAFT PR #8. Triggering Codex review next.
