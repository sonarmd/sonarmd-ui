import React from 'react';

/**
 * forwardRef + displayName in one call. Centralizes the ref-forwarding ceremony
 * every DOM-rendering component repeats: instead of
 * `forwardRef<E, P>(function X(props, ref) {...})` followed by a separate
 * `X.displayName = 'X'`, write `sonarFC<E, P>('X', (props, ref) => {...})`.
 *
 * Internal only - not part of the public API. Memo-wrapped components stay
 * `React.memo(sonarFC('X', render))`; this helper does not memoize.
 *
 * @param displayName Name shown in React DevTools and error overlays.
 * @param render Render function receiving props and the forwarded ref.
 */
export function sonarFC<TElement extends HTMLElement, TProps extends object>(
  displayName: string,
  render: (props: React.PropsWithoutRef<TProps>, ref: React.ForwardedRef<TElement>) => React.ReactElement | null,
): React.ForwardRefExoticComponent<React.PropsWithoutRef<TProps> & React.RefAttributes<TElement>> {
  const Component = React.forwardRef<TElement, TProps>(render);
  Component.displayName = displayName;
  return Component;
}
