import {RefObject, useCallback, useRef} from 'react';

const reducedMotionQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

function prefersReducedMotion(): boolean {
  return reducedMotionQuery?.matches ?? false;
}

/** Reduced-motion substitution: short opacity-only crossfade, no movement. */
function reducedKeyframes(keyframes: Keyframe[]): Keyframe[] {
  if (!keyframes.length) return keyframes;
  const from = keyframes[0];
  const to = keyframes[keyframes.length - 1];
  return [
    {opacity: from.opacity ?? 1},
    {opacity: to.opacity ?? 1},
  ];
}

export interface AnimateOptions extends KeyframeAnimationOptions {
  /** Keyframes to use when prefers-reduced-motion is active. Defaults to opacity-only. */
  reducedKeyframes?: Keyframe[];
}

export interface AnimateControls {
  play: () => void;
  reverse: () => void;
  cancel: () => void;
  /** Resolves when the animation finishes (or rejects on cancel). */
  finished: Promise<void>;
}

/**
 * WAAPI wrapper that is interrupt-safe and centrally respects prefers-reduced-motion.
 * Each call to play() cancels any in-flight animation before starting the new one.
 */
export function useAnimate(
  ref: RefObject<Element | null>,
  keyframes: Keyframe[],
  options: AnimateOptions = {},
): AnimateControls {
  const animRef = useRef<Animation | null>(null);

  const finished = useRef<Promise<void>>(Promise.resolve());

  const play = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Interrupt any running animation. Its finished promise rejects
    // asynchronously and is settled by the resolver captured for THAT animation
    // below, never this new one.
    animRef.current?.cancel();

    // Capture this play's resolver/rejecter locally. Reading them off a shared
    // ref in the settle handler would let a cancelled prior animation reject the
    // new play's promise.
    let resolve!: () => void;
    let reject!: (reason?: unknown) => void;
    finished.current = new Promise<void>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    const reduced = prefersReducedMotion();
    const frames = reduced
      ? (options.reducedKeyframes ?? reducedKeyframes(keyframes))
      : keyframes;
    const dur = reduced
      ? Math.min(typeof options.duration === 'number' ? options.duration : 200, 120)
      : options.duration;

    const anim = el.animate(frames, {
      fill: 'both',
      ...options,
      duration: dur,
    });
    animRef.current = anim;

    anim.finished.then(
      () => resolve(),
      (err) => reject(err),
    );
  }, [ref, keyframes, options]);

  const reverse = useCallback(() => {
    animRef.current?.reverse();
  }, []);

  // Cancelling rejects the animation's finished promise (AbortError), which the
  // settle handler routes to the matching reject() captured in play().
  const cancel = useCallback(() => {
    animRef.current?.cancel();
  }, []);

  // `finished` is exposed as a getter over the ref, not a snapshot: play()
  // swaps finished.current to a fresh promise, and callers (e.g. usePresence's
  // hide) read it AFTER calling play(). Returning finished.current directly
  // would hand back the previous, already-resolved promise and unmount before
  // the exit animation paints.
  return {
    play,
    reverse,
    cancel,
    get finished(): Promise<void> {
      return finished.current;
    },
  };
}
