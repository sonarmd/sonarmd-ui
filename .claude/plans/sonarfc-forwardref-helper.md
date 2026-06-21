# Plan: add sonarFC helper, swap all forwardRef call sites

## Goal
User-provided helper centralizes `React.forwardRef` + `displayName`:
```
export function sonarFC<TElement extends HTMLElement, TProps extends object>(
  displayName, render) { const C = React.forwardRef<TElement,TProps>(render); C.displayName = displayName; return C; }
```
Add it (adapted to repo style: single quotes, semicolons), then swap all 28
forwardRef call sites to use it.

## Findings
- 28 forwardRef components, ALL ref an HTMLElement subtype (no SVG, no
  generic-over-data) -> the `extends HTMLElement` constraint fits every one.
- ~17 are ALSO React.memo-wrapped. The helper does not memo. PRESERVE memo by
  wrapping `React.memo(sonarFC('X', render))`. Dropping memo would be an
  unrequested behavior/perf change.
- 18 files set `.displayName` on their own line today; that line is removed
  (displayName now passed as the first arg).
- Mixed `React.forwardRef` (15) vs named `{forwardRef}` (4) imports; helper
  removes the need for either at call sites.

## Placement
- New file `src/internal/sonarFC.ts` (no JSX). Not added to public index.ts
  exports - internal helper. Imported by components as `../../internal/sonarFC`.

## Transform per call site
- memo+forwardRef: `export const X = React.memo(React.forwardRef<E,P>(function X(props, ref){...})); X.displayName='X';`
  -> `export const X = React.memo(sonarFC<E,P>('X', (props, ref) => {...}));`
- plain forwardRef: `export const X = forwardRef<E,P>(function X(...){...});`
  -> `export const X = sonarFC<E,P>('X', (...) => {...});`
- Drop now-unused `forwardRef`/`memo`-only imports where appropriate; keep React.
- Keep JSDoc, prop interfaces, render bodies byte-identical.

## Verify
- `npm run typecheck`, `npm test`, `npm run build` must stay green.
- Watch: the cssClasses static guard, fixture snapshots (displayName change could
  shift snapshot output - update with justification if so), a11y tests.

## Constraints
- Library source change -> separate branch from the benchmark PR. ASCII only.
  Signed commit. No public API change.

## Status: done
- Added src/internal/sonarFC.ts (render props typed PropsWithoutRef<TProps> to
  satisfy forwardRef's render signature under these React types).
- Swapped 27 of 28 call sites to sonarFC; memo preserved on all 17 memo+forwardRef
  components. Dropped the now-redundant `.displayName =` lines.
- NOT converted: QueryBoundary - it is generic over a data type T via the
  `forwardRef(Inner) as <T>(...)` cast; sonarFC's fixed generics would erase the
  per-call T. Left on forwardRef intentionally.
- typecheck 0 errors, 385 tests pass (no snapshot changes - displayName is not in
  DOM output), build clean. ASCII verified.
