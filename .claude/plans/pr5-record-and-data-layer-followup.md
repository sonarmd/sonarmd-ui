# PR #5 record + data-layer follow-up

Canonical record of how PR #5 (feat/s2-performance -> main) was reviewed and
merged, what slipped, and the follow-up that fixes it. Written because the merge
happened before Codex's final pass finished, so P1 bugs landed in main.

## What PR #5 was

Squash-merged to main as `cf5f914`:
"feat: v1 component library - perf, theming, motion, transitions, data layer,
a11y, docs (#5)".

It carried workstreams S0-S8b on one long-lived branch (a parallel build process
kept pushing S5 transitions, S6 architecture, S7.1 React 18/19 CI matrix, S8b
Ladle cookbook/docs while review was in progress), plus the MultiSelect combobox
a11y fix that started this whole thread.

## What actually happened (timeline)

1. Branch already had an open PR #5 with one Codex (`chatgpt-codex-connector`)
   review. Org ruleset on main: required_signatures, required_linear_history,
   pull_request with required_review_thread_resolution=true and 0 approvals. So
   the merge gate = every review thread resolved + signed + linear + green CI.
2. Codex reviewed in five rounds as new commits landed. Each round I fixed the
   findings, replied on the thread, resolved it, re-triggered `@codex review`.
3. CI initially red: S7.1 shipped a STALE fixtures snapshot, and the new S8b
   stories did not typecheck. Fixed the stories' prop usage (20+ errors), then
   the React 18 vs 19 useId snapshot mismatch (made useId deterministic in the
   fixtures harness), and removed a regenerated yarn.lock (repo is npm-only).
4. With CI green on React 18 + 19, 0 unresolved threads, signed + linear, the
   PR was CLEAN. On explicit instruction ("just push, it's good to go") I
   squash-merged.
5. Codex round 5 posted ~2 minutes AFTER the merge and flagged 4 more issues
   (two P1) in the S6 data layer - now in main. See "Outstanding" below.

## What SHOULD have happened (the process to follow next time)

- DO NOT merge while a Codex review is in flight. The "eyes" reaction means a
  pass is running; wait for it to land (a posted review or a / reaction) and
  for all resulting threads to be resolved BEFORE merging. The gate is "Codex has
  no more feedback," not "Codex has no feedback yet."
- One PR per coherent unit of work. A single branch absorbing S0-S8b made the
  review a moving target: every new commit reset what Codex had to look at, so
  findings arrived in waves and the data layer (S6) was only reached on the pass
  that landed after merge. Smaller PRs converge.
- Snapshots must be version-agnostic before a React-version CI matrix is added,
  not after. useId is nondeterministic across React majors; the harness now
  mocks it.
- Commit the artifacts a workstream depends on WITH that workstream (S7.1 shipped
  without its regenerated snapshot, which is what turned CI red).
- Each `git` mutation runs the sequential-thinking gate first; commits stay
  signed (SSH signing needs the sandbox disabled so git can read the key).

## Every Codex finding and its fix

Resolved before merge (all in PR #5 / main):
- usePresence/useAnimate: `finished` was a render-time snapshot, so `hide()`
  unmounted before the exit animation -> getter over the live ref.
- useAnimate: an interrupted animation's async cancel rejected the NEW promise ->
  capture resolve/reject per play().
- usePresence: fast re-show before exit finished still unmounted -> generation
  guard + cancel the in-flight exit on show().
- AppShell: `.sidebarCollapsed` repeated the default columns (collapse was a
  no-op) -> pin the column to var(--smd-sidebar-width-collapsed) and propagate
  collapse into the Sidebar via cloneElement; `contextRail` uses a nullish check
  so a null rail is treated as absent.
- GaugeChart: dark theme never recolored gauge detail/title/axisLabel ->
  chartChrome takes the option's series and emits index-aligned overrides.
- Stack/Cluster/Columns/Spacer: `{...rest}` overwrote `className={styles.root}`
  -> destructure and merge className.
- TransitionContainer: a stale exit completion cleared the newer outgoing slot
  -> generation guard.
- StackedBarChart: tooltip total separator used a JS-captured light token ->
  var(--smd-border-default) so it re-themes in the formatter HTML.
- useQuery (round 4): the deduped in-flight request used the first subscriber's
  AbortSignal; first unmount aborted it for everyone -> the shared request owns
  its own AbortController and is refcounted (aborted only when the last
  subscriber leaves); refetch() is standalone.
- client.ts (round 4): sanitizeUrl threw on a relative baseUrl like '/api' ->
  `new URL(url, 'http://localhost')` (only the pathname is used).
- README (round 4): cookbook imported Fade from '@sonarmd/ui/motion' (it is a
  root export) -> import from '@sonarmd/ui'.

## Outstanding - round 5, landed after merge, now in main (FIX THESE)

Branch: `fix/data-layer-stability` (off main `cf5f914`).

1. [P1] useQuery.ts - inline (non-memoized) fetcher changed the effect deps every
   render -> loading/abort/restart forever (the documented recipe spins). FIX:
   keep the latest fetcher in a ref; drop it from the effect deps.  STATUS: DONE
   on the follow-up branch (uncommitted).
2. [P1] usePaginatedQuery.ts - inline config object did the same to page 0. FIX:
   configRef + fetchPage made stable; config treated as stable for the hook's
   life.  STATUS: DONE (uncommitted).
3. [P2, PHI] useQuery.ts - staleTime freshness used the previous key's timestamp,
   so ['patient', newId] could skip fetching and render the OLD patient's data.
   FIX: cache timestamp scoped to the serialized key.  STATUS: DONE (uncommitted).
4. [P2] client.ts - RequestInit.headers can be a Headers instance or tuple array;
   spreading as a record drops them, silently omitting auth/tenant headers. FIX:
   normalize through `new Headers(init?.headers)` before merging.  STATUS: DONE
   (uncommitted).

Also in this follow-up (per direct request): removed the React 18/19 CI matrix.
The project now develops and tests on a single React version (18, the dev pin);
the peerDependency stays `>=18.0.0` so consumers on 18 or 19 can still install.
ci.yml is back to the single self-contained `gate` job.

## Follow-up plan to land the fixes

1. Finish fix #4 (client.ts header normalization).
2. typecheck + full vitest + build + size; ASCII-scan changed files.
3. Commit (signed), push `fix/data-layer-stability`.
4. Open ONE PR to main. Let Codex review. Resolve every thread it raises.
5. Wait for Codex to have NO more feedback (no in-flight pass), CI green on both
   React versions, 0 unresolved threads -> squash merge.

## Known pre-existing issue (separate small PR, not blocking)

Several components render non-ASCII punctuation (em/en dashes, ellipsis) in their
DOM - Dropdown, Typeahead, CheckboxGroup, Toast, KpiCard, DataTable. Pre-existing,
violates the ASCII rule, surfaced via the snapshot. Worth its own cleanup PR.
