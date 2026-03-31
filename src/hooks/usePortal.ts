import {useRef, useEffect} from 'react';

/**
 * Creates a stable portal container element, appended to document.body on mount
 * and removed on unmount. The container is created exactly once and stored in a ref.
 *
 * Rule 8: Portal containers are created once, not on every render.
 */
export function usePortal(): HTMLElement {
  const portalRef = useRef<HTMLElement | null>(null);

  // Lazy-init: create the element synchronously on first access so it's
  // available for the first render (before useEffect fires).
  if (portalRef.current === null) {
    const el = document.createElement('div');
    el.setAttribute('data-smd-portal', '');
    portalRef.current = el;
  }

  useEffect(() => {
    const el = portalRef.current!;
    document.body.appendChild(el);
    return () => {
      if (document.body.contains(el)) {
        document.body.removeChild(el);
      }
    };
  }, []);

  return portalRef.current;
}
