import {ComponentType, createElement} from 'react';
import {TransitionContainer, TransitionDirection} from './TransitionContainer';
import {PatternName} from './patterns';

/**
 * The subset of react-router APIs that the adapter uses. Typed here so the
 * core module never imports from react-router directly - the adapter factory
 * receives these as arguments, keeping the core router-agnostic.
 */
export interface RouterAdapterDeps {
  useLocation: () => {key: string; pathname: string};
  useNavigationType: () => 'POP' | 'PUSH' | 'REPLACE';
  /** Render the matched child route. */
  Outlet: ComponentType<object>;
  /**
   * Access the current route's handle. The adapter reads `handle.transition`
   * for a per-route pattern override (Criterion 5.3).
   */
  useMatches?: () => Array<{handle?: {transition?: string}}>;
}

export interface TransitionOutletProps {
  /** Default pattern when no route handle overrides it. */
  defaultPattern?: PatternName;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Factory that closes over the react-router hooks and produces a
 * `TransitionOutlet` component. Call once at app setup:
 *
 *   import * as RR from 'react-router-dom';
 *   const TransitionOutlet = createTransitionOutlet(RR);
 *
 *   // In your layout:
 *   <TransitionOutlet />
 */
export function createTransitionOutlet(deps: RouterAdapterDeps) {
  const {useLocation, useNavigationType, Outlet, useMatches} = deps;

  function TransitionOutlet({defaultPattern, className, style}: TransitionOutletProps) {
    const location = useLocation();
    const navType = useNavigationType();

    const matches = useMatches?.() ?? [];
    const deepestHandle = [...matches].reverse().find((m) => m.handle?.transition);
    const routePattern = deepestHandle?.handle?.transition;

    const direction: TransitionDirection =
      navType === 'POP' ? 'back' : navType === 'REPLACE' ? 'replace' : 'forward';

    const pattern = routePattern ?? defaultPattern;

    return createElement(
      TransitionContainer,
      {locationKey: location.key, direction, pattern, className, style, children: createElement(Outlet, {})},
    );
  }

  TransitionOutlet.displayName = 'TransitionOutlet';
  return TransitionOutlet;
}
