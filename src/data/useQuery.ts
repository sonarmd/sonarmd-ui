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

// Shared in-flight dedup: serialized key -> one request shared by all current
// subscribers. The request owns its own AbortController and is aborted only when
// the LAST subscriber detaches (refcount), so one component unmounting never
// cancels the fetch a still-mounted sibling depends on.
interface InflightEntry {
  promise: Promise<unknown>;
  controller: AbortController;
  refs: number;
}
const inflight = new Map<string, InflightEntry>();

function acquire<T>(
  key: string,
  fetcher: (signal: AbortSignal) => Promise<T>,
): InflightEntry {
  let entry = inflight.get(key);
  if (!entry) {
    const controller = new AbortController();
    const created: InflightEntry = {
      promise: fetcher(controller.signal),
      controller,
      refs: 0,
    };
    created.promise.finally(() => {
      if (inflight.get(key) === created) inflight.delete(key);
    });
    inflight.set(key, created);
    entry = created;
  }
  entry.refs += 1;
  return entry;
}

function release(key: string, entry: InflightEntry): void {
  entry.refs -= 1;
  if (entry.refs <= 0) {
    entry.controller.abort();
    if (inflight.get(key) === entry) inflight.delete(key);
  }
}

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

  // Track the serial of the most-recently started fetch so stale responses from
  // aborted or superseded fetches are silently dropped.
  const fetchSerial = useRef(0);
  const cachedAt = useRef<number | null>(null);

  const serializedKey = serializeKey(key);

  // Route a settled promise to dispatch, dropping superseded/aborted results.
  const settle = useCallback((serial: number, promise: Promise<T>) => {
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
  }, []);

  const refetch = useCallback(() => {
    // Explicit refresh: a standalone request with its own signal, not shared
    // through the dedup map (and not subject to staleTime).
    const serial = ++fetchSerial.current;
    dispatch({type: 'loading'});
    const controller = new AbortController();
    settle(serial, fetcher(controller.signal));
  }, [fetcher, settle]);

  useEffect(() => {
    if (!enabled) return;

    // Stale-while-revalidate: skip if cached data is still fresh.
    if (
      cachedAt.current != null &&
      staleTime > 0 &&
      Date.now() - cachedAt.current < staleTime
    ) {
      return;
    }

    const serial = ++fetchSerial.current;
    dispatch({type: 'loading'});
    const entry = acquire<T>(serializedKey, fetcher);
    settle(serial, entry.promise as Promise<T>);

    return () => release(serializedKey, entry);
  }, [enabled, serializedKey, staleTime, fetcher, settle]);

  return {...state, refetch};
}
