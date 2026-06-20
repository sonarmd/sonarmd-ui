import {useCallback, useEffect, useRef} from 'react';

export interface UseInfiniteScrollOptions {
  /** Whether another page exists to load. */
  hasNext: boolean;
  /** Whether the next page is already in flight (prevents duplicate loads). */
  isLoadingNext: boolean;
  /** Called when the sentinel nears view. */
  onLoadMore: () => void;
  /**
   * IntersectionObserver rootMargin. The default prefetches one viewport early
   * so content is ready before the end is reached. Default '200px'. Read once,
   * when the sentinel mounts.
   */
  rootMargin?: string;
  /** Scroll container to observe within; defaults to the viewport. Read once. */
  root?: Element | null;
}

export interface InfiniteScroll<T extends Element> {
  /** Attach to a sentinel element rendered at the end of the list. */
  sentinelRef: (node: T | null) => void;
}

/**
 * The basic (non-virtualized) half of infinite scroll: place the returned
 * `sentinelRef` on a small element at the end of a normally-rendered list; an
 * IntersectionObserver calls `onLoadMore` when it nears view. Simple and fine
 * for small-to-medium lists, but every loaded item stays in the DOM - for large
 * sets prefer `useVirtualInfinite`, which windows the DOM. Separable: works with
 * any data source via hasNext/isLoadingNext/onLoadMore.
 */
export function useInfiniteScroll<T extends Element = HTMLDivElement>({
  hasNext,
  isLoadingNext,
  onLoadMore,
  rootMargin = '200px',
  root = null,
}: UseInfiniteScrollOptions): InfiniteScroll<T> {
  // Latest values read at fire time so the observer never holds a stale closure.
  const stateRef = useRef({hasNext, isLoadingNext, onLoadMore, root, rootMargin});
  stateRef.current = {hasNext, isLoadingNext, onLoadMore, root, rootMargin};

  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback((node: T | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const s = stateRef.current;
        if (entries.some((e) => e.isIntersecting) && s.hasNext && !s.isLoadingNext) {
          s.onLoadMore();
        }
      },
      {root: stateRef.current.root, rootMargin: stateRef.current.rootMargin},
    );
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return {sentinelRef};
}
