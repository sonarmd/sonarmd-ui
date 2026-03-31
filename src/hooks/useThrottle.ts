import {useRef, useCallback} from 'react';

/**
 * Returns a stable throttled version of the given callback.
 * The callback is invoked at most once per `limitMs` milliseconds.
 *
 * Rule 13: Resize/scroll handlers must be throttled (not debounced).
 */
export function useThrottle<T extends (...args: unknown[]) => void>(
  fn: T,
  limitMs: number,
): T {
  const lastCalledRef = useRef(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  return useCallback(
    (...args: unknown[]) => {
      const now = Date.now();
      if (now - lastCalledRef.current >= limitMs) {
        lastCalledRef.current = now;
        fnRef.current(...args);
      }
    },
    [limitMs],
  ) as T;
}
