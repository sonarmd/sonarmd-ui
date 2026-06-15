import {useCallback, useEffect, useReducer, useRef} from 'react';

export type QueryStatus = 'idle' | 'loading' | 'success' | 'error';

export interface QueryState<T> {
  status: QueryStatus;
  data: T | undefined;
  error: Error | undefined;
}

export interface QueryResult<T> extends QueryState<T> {
  refetch: () => void;
}

export interface QueryOptions {
  /**
   * Time in ms before cached data is considered stale and a background
   * refetch fires on remount. Default: 0 (always refetch on remount).
   */
  staleTime?: number;
  /** Skip fetching entirely while false. */
  enabled?: boolean;
}

type Action<T> =
  | {type: 'loading'}
  | {type: 'success'; data: T}
  | {type: 'error'; error: Error};

function reducer<T>(state: QueryState<T>, action: Action<T>): QueryState<T> {
  switch (action.type) {
    case 'loading':
      return {...state, status: 'loading'};
    case 'success':
      return {status: 'success', data: action.data, error: undefined};
    case 'error':
      return {status: 'error', data: state.data, error: action.error};
    default:
      return state;
  }
}

// Shared in-flight dedup map: key (serialized) -> Promise.
const inflight = new Map<string, Promise<unknown>>();

/** Stable serialization for primitive/array/object keys. */
function serializeKey(key: unknown[]): string {
  return JSON.stringify(key);
}

export function useQuery<T>(
  key: unknown[],
  fetcher: (signal: AbortSignal) => Promise<T>,
  options: QueryOptions = {},
): QueryResult<T> {
  const {staleTime = 0, enabled = true} = options;

  const [state, dispatch] = useReducer(reducer<T>, {
    status: 'idle',
    data: undefined,
    error: undefined,
  });

  // Track the serial number of the most-recently started fetch so stale
  // responses from aborted or superseded fetches are silently dropped.
  const fetchSerial = useRef(0);
  const cachedAt = useRef<number | null>(null);

  const serializedKey = serializeKey(key);

  const run = useCallback(
    (signal: AbortSignal) => {
      const serial = ++fetchSerial.current;

      // Stale-while-revalidate: skip if data is fresh.
      if (
        cachedAt.current != null &&
        staleTime > 0 &&
        Date.now() - cachedAt.current < staleTime
      ) {
        return;
      }

      dispatch({type: 'loading'});

      // Deduplication: reuse an in-flight promise for the same key.
      let promise = inflight.get(serializedKey) as Promise<T> | undefined;
      if (!promise) {
        promise = fetcher(signal);
        inflight.set(serializedKey, promise);
        promise.finally(() => inflight.delete(serializedKey));
      }

      promise.then(
        (data) => {
          if (fetchSerial.current !== serial) return;
          cachedAt.current = Date.now();
          dispatch({type: 'success', data});
        },
        (err: unknown) => {
          if (fetchSerial.current !== serial) return;
          if ((err as {name?: string}).name === 'AbortError') return;
          dispatch({type: 'error', error: err instanceof Error ? err : new Error(String(err))});
        },
      );
    },
    // fetcher identity is the caller's responsibility (useCallback or stable ref).
    // serializedKey is stable as long as the key array contents are stable.
    [serializedKey, staleTime, fetcher],
  );

  const refetch = useCallback(() => {
    const controller = new AbortController();
    run(controller.signal);
  }, [run]);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    run(controller.signal);
    return () => {
      controller.abort();
    };
  }, [enabled, run]);

  return {...state, refetch};
}
