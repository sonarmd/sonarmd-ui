import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {PatternName, patterns, DEFAULT_PATTERN, reducedPattern} from './patterns';

const prefersReduced =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

export type TransitionDirection = 'forward' | 'back' | 'replace';

export interface TransitionContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Changing this key triggers a transition from the previous to the new children. */
  locationKey: string;
  /** Controls which directional pattern is used. */
  direction?: TransitionDirection;
  /**
   * Which canonical pattern to play. Unknown names fall back to 'swap' with
   * a console.warn in development.
   */
  pattern?: PatternName | string;
  children: ReactNode;
}

interface Slot {
  key: string;
  node: ReactNode;
}

interface PendingTransition {
  patternName: string | undefined;
  direction: TransitionDirection;
}

function animate(
  el: Element,
  keyframes: Keyframe[],
  duration: number,
  easing: string,
): Promise<void> {
  const anim = el.animate(keyframes, {duration, easing, fill: 'both'});
  return anim.finished.then(() => { /* void */ }, () => { /* cancelled */ });
}

/**
 * Router-agnostic transition host. When `locationKey` changes it plays the
 * exit animation on the outgoing slot and the enter animation on the incoming
 * slot simultaneously, then removes the outgoing slot after exit completes.
 *
 * Does NOT import react-router. Drive it from createTransitionOutlet or any
 * custom adapter.
 */
export const TransitionContainer = forwardRef<HTMLDivElement, TransitionContainerProps>(
  function TransitionContainer(
    {locationKey, direction = 'forward', pattern, children, style, ...rest},
    ref,
  ) {
    const [outgoing, setOutgoing] = useState<Slot | null>(null);
    const [incoming, setIncoming] = useState<Slot>({key: locationKey, node: children});

    const outRef = useRef<HTMLDivElement>(null);
    const inRef = useRef<HTMLDivElement>(null);

    const prevKeyRef = useRef(locationKey);
    const prevChildrenRef = useRef(children);

    // Captures the pattern+direction active at the moment of navigation so the
    // animation effect reads stable values and needs only [outgoing] in its deps.
    const pendingRef = useRef<PendingTransition | null>(null);

    // Bumped per exit so a stale exit completion (rapid back/forward before the
    // previous exit finishes) cannot clear the newer outgoing slot.
    const exitGenRef = useRef(0);

    const resolvePattern = useCallback(
      (name: string | undefined, dir: TransitionDirection): typeof patterns[PatternName] => {
        if (!name) {
          return patterns[dir === 'back' ? 'nav-back' : 'nav-forward'];
        }
        if (name in patterns) return patterns[name as PatternName];
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[TransitionContainer] Unknown pattern "${name}", falling back to "${DEFAULT_PATTERN}".`);
        }
        return patterns[DEFAULT_PATTERN];
      },
      [],
    );

    useLayoutEffect(() => {
      if (locationKey === prevKeyRef.current) return;

      // Capture the active params before state updates so the effect gets them.
      pendingRef.current = {patternName: pattern, direction};

      const outSlot: Slot = {key: prevKeyRef.current, node: prevChildrenRef.current};
      prevKeyRef.current = locationKey;
      prevChildrenRef.current = children;

      setOutgoing(outSlot);
      setIncoming({key: locationKey, node: children});
    }, [locationKey, children, pattern, direction]);

    useEffect(() => {
      if (!outgoing) return;

      const outEl = outRef.current;
      const inEl = inRef.current;

      const pending = pendingRef.current ?? {patternName: pattern, direction};
      let p = resolvePattern(pending.patternName, pending.direction);
      if (prefersReduced?.matches) p = reducedPattern(p);

      // Remove outgoing after exit completes; enter runs concurrently. Guard the
      // completion by generation so a stale exit cannot clear a newer outgoing
      // slot during rapid navigation.
      const gen = (exitGenRef.current += 1);
      if (outEl) {
        animate(outEl, p.exitKeyframes, p.exitDuration, p.exitEasing)
          .then(() => {
            if (exitGenRef.current === gen) setOutgoing(null);
          });
      } else {
        setOutgoing(null);
      }

      if (inEl) {
        animate(inEl, p.enterKeyframes, p.enterDuration, p.enterEasing);
      }
    }, [outgoing, resolvePattern, pattern, direction]);

    // After incoming mounts, move focus to the new content for a11y (5.6).
    useEffect(() => {
      const el = inRef.current;
      if (!el) return;
      const heading = el.querySelector('h1, h2, [data-autofocus]') as HTMLElement | null;
      const target = heading ?? el;
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({preventScroll: true});
    }, [incoming.key]);

    return (
      <div
        ref={ref}
        style={{position: 'relative', overflow: 'hidden', ...style}}
        aria-live="polite"
        {...rest}
      >
        {outgoing && (
          <div
            ref={outRef}
            key={outgoing.key}
            style={{position: 'absolute', inset: 0, willChange: 'transform, opacity'}}
            aria-hidden="true"
          >
            {outgoing.node}
          </div>
        )}
        <div
          ref={inRef}
          key={incoming.key}
          style={{position: 'relative', willChange: 'transform, opacity'}}
        >
          {incoming.node}
        </div>
      </div>
    );
  },
);
