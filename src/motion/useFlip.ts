import {RefObject, useCallback, useRef} from 'react';
import {AnimateOptions} from './useAnimate';

const reducedMotionQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

export interface FlipOptions extends AnimateOptions {
  duration?: number;
}

/**
 * FLIP (First-Last-Invert-Play) hook for compositor-only layout transitions.
 * Records the element's position before a DOM update, then animates
 * from the delta transform to identity after the update.
 *
 * Usage:
 *   const flip = useFlip(ref, { duration: 300 });
 *   flip.record();   // call before the state change that moves the element
 *   setState(...);
 *   // In a useEffect/useLayoutEffect after render:
 *   flip.play();
 */
export function useFlip(ref: RefObject<Element | null>, options: FlipOptions = {}) {
  const firstRect = useRef<DOMRect | null>(null);
  const animRef = useRef<Animation | null>(null);

  const record = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    firstRect.current = el.getBoundingClientRect();
  }, [ref]);

  const play = useCallback(() => {
    const el = ref.current;
    const first = firstRect.current;
    if (!el || !first) return;

    const last = el.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    const sx = first.width / (last.width || 1);
    const sy = first.height / (last.height || 1);

    if (dx === 0 && dy === 0 && sx === 1 && sy === 1) return;

    if (animRef.current) animRef.current.cancel();

    const reduced = reducedMotionQuery?.matches ?? false;
    const frames: Keyframe[] = reduced
      ? [{opacity: 0.85}, {opacity: 1}]
      : [
          {transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`},
          {transform: 'translate(0, 0) scale(1, 1)'},
        ];

    const anim = el.animate(frames, {
      duration: options.duration ?? 300,
      easing: options.easing ?? 'cubic-bezier(0, 0, 0.2, 1)',
      fill: 'both',
    });
    animRef.current = anim;
    firstRect.current = null;
  }, [ref, options]);

  return {record, play};
}
