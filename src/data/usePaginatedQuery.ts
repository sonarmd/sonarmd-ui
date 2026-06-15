import {useCallback, useEffect, useReducer, useRef} from 'react';

export type PaginatedStatus = 'idle' | 'loading' | 'success' | 'error' | 'fetching-next';

export interface PaginatedState<T> {
  status: PaginatedStatus;
  pages: T[];
  error: Error | undefined;
  hasNext: boolean;
}

export interface PaginatedResult<T> extends PaginatedState<T> {
  fetchNext: () => void;
  refetch: () => void;
}

export interface PaginationCursorConfig<T, C = unknown> {
  kind: 'cursor';
  /** Extract the cursor for the next page from the last page response. */
  getNextCursor: (lastPage: T) => C | null | undefined;
  /** Build the fetcher for a given cursor (undefined = first page). */
  fetcher: (cursor: C | undefined, signal: AbortSignal) => Promise<T>;
}

export interface PaginationPageConfig<T> {
  kind: 'page';
  /** Determine whether there is a next page from the last page response. */
  hasNextPage: (lastPage: T, pageIndex: number) => boolean;
  /** Build the fetcher for a given page index (0-based). */
  fetcher: (page: number, signal: AbortSignal) => Promise<T>;
}

export type PaginationConfig<T, C = unknown> =
  | PaginationCursorConfig<T, C>
  | PaginationPageConfig<T>;

interface State<T> {
  status: PaginatedStatus;
  pages: T[];
  error: Error | undefined;
  hasNext: boolean;
  // Cursor mode: next cursor. Page mode: next page index.
  next: unknown;
}

type Action<T> =
  | {type: 'loading'}
  | {type: 'fetching-next'}
  | {type: 'first-success'; page: T; hasNext: boolean; next: unknown}
  | {type: 'next-success'; page: T; hasNext: boolean; next: unknown}
  | {type: 'error'; error: Error};

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'loading':
      return {status: 'loading', pages: [], error: undefined, hasNext: false, next: undefined};
    case 'fetching-next':
      return {...state, status: 'fetching-next'};
    case 'first-success':
      return {status: 'success', pages: [action.page], error: undefined, hasNext: action.hasNext, next: action.next};
    case 'next-success':
      return {
        status: 'success',
        // Stable identity: spread existing pages, append new one.
        pages: [...state.pages, action.page],
        error: undefined,
        hasNext: action.hasNext,
        next: action.next,
      };
    case 'error':
      return {...state, status: 'error', error: action.error};
    default:
      return state;
  }
}

export function usePaginatedQuery<T, C = unknown>(
  config: PaginationConfig<T, C>,
): PaginatedResult<T> {
  const [state, dispatch] = useReducer(reducer<T>, {
    status: 'idle',
    pages: [],
    error: undefined,
    hasNext: false,
    next: undefined,
  });

  const fetchSerial = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  function resolvePagination(page: T, pageIndex: number): {hasNext: boolean; next: unknown} {
    if (config.kind === 'cursor') {
      const cursor = config.getNextCursor(page);
      return {hasNext: cursor != null, next: cursor};
    }
    return {hasNext: config.hasNextPage(page, pageIndex), next: pageIndex + 1};
  }

  const fetchPage = useCallback(
    (isFirst: boolean, signal: AbortSignal) => {
      const serial = ++fetchSerial.current;
      const currentState = stateRef.current;

      if (isFirst) {
        dispatch({type: 'loading'});
      } else {
        dispatch({type: 'fetching-next'});
      }

      let promise: Promise<T>;
      if (config.kind === 'cursor') {
        const cursor = isFirst ? undefined : (currentState.next as C | undefined);
        promise = config.fetcher(cursor, signal);
      } else {
        const page = isFirst ? 0 : (currentState.next as number ?? 0);
        promise = config.fetcher(page, signal);
      }

      const pageIndex = isFirst ? 0 : (currentState.pages.length);

      promise.then(
        (page) => {
          if (fetchSerial.current !== serial) return;
          const {hasNext, next} = resolvePagination(page, pageIndex);
          dispatch(isFirst
            ? {type: 'first-success', page, hasNext, next}
            : {type: 'next-success', page, hasNext, next},
          );
        },
        (err: unknown) => {
          if (fetchSerial.current !== serial) return;
          if ((err as {name?: string}).name === 'AbortError') return;
          dispatch({type: 'error', error: err instanceof Error ? err : new Error(String(err))});
        },
      );
    },
    // config is expected to be stable (created outside render or memoized).
    [config],
  );

  const controllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    fetchPage(true, controller.signal);
  }, [fetchPage]);

  const fetchNext = useCallback(() => {
    if (!stateRef.current.hasNext || stateRef.current.status === 'fetching-next') return;
    const controller = new AbortController();
    controllerRef.current = controller;
    fetchPage(false, controller.signal);
  }, [fetchPage]);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    fetchPage(true, controller.signal);
    return () => controller.abort();
  }, [fetchPage]);

  return {
    status: state.status,
    pages: state.pages,
    error: state.error,
    hasNext: state.hasNext,
    fetchNext,
    refetch,
  };
}
