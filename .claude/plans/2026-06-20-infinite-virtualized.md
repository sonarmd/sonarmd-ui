# Virtualized + basic infinite scroll (2026-06-20)

Goal: lazy-load paginated data as the user scrolls, with windowing (mount/unmount
rows, fixed overscan) so the DOM stays small. Two separable, composable hooks +
one drop-in virtualized list. Generic over the data source (not tied to
usePaginatedQuery, but composes with it via hasNext/isLoadingNext/onLoadMore).

## Deliverables

1. `src/data/useVirtualInfinite.ts` (PRIMARY) - the windowed path. Given
   itemCount/hasNext/isLoadingNext/onLoadMore, returns `{rowCount, onRowsRendered,
   isLoaderRow}` to wire into react-window v2's `List` (onRowsRendered fires with
   {startIndex, stopIndex}). Triggers onLoadMore when stopIndex reaches
   itemCount - thresholdRows, guarded by hasNext && !isLoadingNext. rowCount adds
   one trailing loader row when hasNext. Stable handler via a state ref (no stale
   closures, no re-subscribe churn).

2. `src/data/useInfiniteScroll.ts` (basic) - non-virtualized sentinel. Returns
   `{sentinelRef}` to place a div at the list end; an IntersectionObserver calls
   onLoadMore when it nears view (rootMargin prefetch). Honest about the tradeoff:
   simple, fine for small/medium lists; the DOM grows, so prefer
   useVirtualInfinite for large sets. Separable - usable on its own.

3. `src/components/InfiniteList/` - composes useVirtualInfinite + react-window
   `List`. Props: items, rowHeight, height, renderRow, getRowKey, hasNext,
   isLoadingNext, onLoadMore, overscanCount, thresholdRows, loadingRow,
   emptyState, ariaLabel. role="list"/"listitem", aria-busy while loading, polite
   live region announcing "Loading more". The loader row renders at index >=
   items.length.

## Wiring

- Hooks exported from `./data` (src/data/index.ts) alongside usePaginatedQuery.
- InfiniteList exported from core (src/index.ts) - it's a UI component (uses
  react-window, already an externalized dep, like DataTable).

## Tests

- useVirtualInfinite: triggers near end; not when isLoadingNext; not when
  !hasNext; rowCount/loader-row math. (Pure logic - fully jsdom-testable.)
- useInfiniteScroll: mock IntersectionObserver to capture + fire the callback;
  asserts onLoadMore guarded by hasNext/!isLoadingNext; observer disconnects on
  unmount.
- InfiniteList: fixtures (snapshot + axe under the global react-window mock) +
  a behavioral check that the loader row appears when hasNext.

## Gates / merge

typecheck, full vitest, build, size, ASCII. Signed with the agora SEP agent key
(repo-local config already set). PR off main -> CI -> Codex review (fix + resolve
threads via GraphQL) -> squash-merge.
