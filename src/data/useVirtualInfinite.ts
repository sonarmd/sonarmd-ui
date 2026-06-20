import {useCallback, useRef} from 'react';

export interface UseVirtualInfiniteOptions {
  /** Number of real (loaded) items currently rendered. */
  itemCount: number;
  /** Whether another page exists to load. */
  hasNext: boolean;
  /** Whether the next page is already in flight (prevents duplicate loads). */
  isLoadingNext: boolean;
  /** Called to load the next page when the user scrolls near the end. */
  onLoadMore: () => void;
  /**
   * How many rows from the end to start loading the next page, so data arrives
   * before the user hits the bottom. Default 8.
   */
  thresholdRows?: number;
}

export interface VirtualInfinite {
  /**
   * Row count to pass to react-window. Equals itemCount, plus one trailing
   * loader row while another page exists (render `loadingRow` at that index).
   */
  rowCount: number;
  /**
   * Pass to react-window v2 `List`'s `onRowsRendered`. Fires `onLoadMore` when
   * the last visible row is within `thresholdRows` of the end and a page is
   * available and not already loading.
   */
  onRowsRendered: (visible: {startIndex: number; stopIndex: number}) => void;
  /** True for the trailing loader row index (>= itemCount). */
  isLoaderRow: (index: number) => boolean;
}

/**
 * The windowed half of infinite scroll: keep the DOM small via react-window
 * (rows mount/unmount as you scroll) and lazily load the next page as the
 * rendered range approaches the end. Generic over the data source - feed it
 * `usePaginatedQuery` (or anything) via hasNext/isLoadingNext/onLoadMore. Pair
 * the returned `rowCount`/`onRowsRendered` with a `List`, and render the loader
 * row where `isLoaderRow(index)` is true.
 */
export function useVirtualInfinite({
  itemCount,
  hasNext,
  isLoadingNext,
  onLoadMore,
  thresholdRows = 8,
}: UseVirtualInfiniteOptions): VirtualInfinite {
  // Latest values in a ref so onRowsRendered stays referentially stable (react-
  // window does not need a new handler each render) without reading stale state.
  const stateRef = useRef({itemCount, hasNext, isLoadingNext, onLoadMore, thresholdRows});
  stateRef.current = {itemCount, hasNext, isLoadingNext, onLoadMore, thresholdRows};

  // Latch: at most one onLoadMore per item-count value. react-window can report
  // several near-end ranges before the parent re-renders with isLoadingNext, and
  // an async onLoadMore may not flip loading synchronously - without this, a fast
  // scroll would request the same page repeatedly and append duplicate rows. The
  // latch releases once the page arrives (itemCount changes).
  const triggeredAtCountRef = useRef(-1);

  const onRowsRendered = useCallback((visible: {startIndex: number; stopIndex: number}) => {
    const s = stateRef.current;
    if (
      s.hasNext &&
      !s.isLoadingNext &&
      triggeredAtCountRef.current !== s.itemCount &&
      visible.stopIndex >= s.itemCount - s.thresholdRows
    ) {
      triggeredAtCountRef.current = s.itemCount;
      s.onLoadMore();
    }
  }, []);

  const isLoaderRow = useCallback((index: number) => index >= itemCount, [itemCount]);

  return {rowCount: itemCount + (hasNext ? 1 : 0), onRowsRendered, isLoaderRow};
}
