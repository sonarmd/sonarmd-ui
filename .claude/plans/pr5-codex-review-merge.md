# PR #5: address Codex review, then squash-merge to main

PR: https://github.com/sonarmd/sonarmd-ui/pull/5  (feat/s2-performance -> main)
Merge is BLOCKED by org ruleset "Main for Single Owner or Agents":
required_signatures, required_linear_history, pull_request with
required_review_thread_resolution=true (0 approvals). CI already green. So the
gate is: resolve every Codex thread + keep signed + linear -> squash merge.

## Codex P2 comments to fix

1. `src/motion/useAnimate.ts` (surfaced at usePresence.ts:52) - `finished` is
   returned as `finished.current` captured at render, so `play()` swapping the
   ref never reaches a caller holding the old (resolved) promise; `hide()`
   unmounts before the exit animation paints. Fix: return `finished` as a getter
   over the stable ref so `exit.finished` reads the current promise after play().

2. `src/components/AppShell` - `.root.sidebarCollapsed` set the same `auto 1fr`
   as default, so collapse changed nothing and the 256px sidebar squeezed
   content. Fix: (a) CSS narrows the column to `var(--smd-sidebar-width-collapsed)`
   when collapsed; (b) AppShell propagates its responsive collapse into the
   sidebar element via cloneElement (`collapsed = sidebarCollapsed || existing`)
   so the Sidebar renders in icon mode. Never forces expand.

3. `src/charts/chartTheme.ts` + `ChartCanvas` - dark theme never re-colored gauge
   series `detail`/`title`/`axisLabel`; they stayed light text on a dark canvas.
   Fix: `chartChrome` takes an optional 3rd arg (the option's series) and emits
   per-index overrides re-coloring gauge label chrome from the theme token map;
   ChartCanvas.applyChrome passes `optionRef.current.series`. Existing 2-arg test
   callers unaffected; add a gauge re-theme test.

Also commit the already-finished MultiSelect active-descendant work
(index.tsx + MultiSelect.test.tsx + test-setup.ts + docs) onto this branch.

## Merge loop
push (signed) -> reply to each thread + resolve (GraphQL resolveReviewThread) ->
comment "@codex review" -> poll for a fresh review -> address any new threads ->
when no open threads + CI green -> `gh pr merge 5 --squash`. Repeat for next PR.

## Guardrails
ASCII only; zero new runtime deps; compositor-only motion; semantic tokens only;
signed commits (no bypass); base is main (never staging).
