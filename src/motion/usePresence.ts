import {useCallback, useEffect, useRef, useState} from 'react';
import {useAnimate, AnimateOptions} from './useAnimate';

export interface PresenceOptions {
  /** Keyframes to play when the element enters (mounts). */
  enterKeyframes: Keyframe[];
  /** Keyframes to play when the element exits. Element is removed after completion. */
  exitKeyframes: Keyframe[];
  enterOptions?: AnimateOptions;
  exitOptions?: AnimateOptions;
}

export interface PresenceControls {
  /** Whether the element should be in the DOM. */
  mounted: boolean;
  /** Ref to attach to the animating element. */
  ref: React.RefObject<Element | null>;
  /** Call to trigger the exit animation then unmount. */
  hide: () => void;
  /** Call to mount and play the enter animation. */
  show: () => void;
}

/**
 * Manages mount/unmount with enter and exit animations.
 * The element stays in the DOM until the exit animation completes.
 */
export function usePresence(
  initial: boolean,
  {enterKeyframes, exitKeyframes, enterOptions = {}, exitOptions = {}}: PresenceOptions,
): PresenceControls {
  const [mounted, setMounted] = useState(initial);
  const elRef = useRef<Element | null>(null);
  // Bumped on every show()/hide() so a pending exit callback can tell whether it
  // is still the latest intent before it unmounts.
  const exitGen = useRef(0);

  const enter = useAnimate(elRef, enterKeyframes, {duration: 200, ...enterOptions});
  const exit = useAnimate(elRef, exitKeyframes, {duration: 200, ...exitOptions});

  useEffect(() => {
    if (mounted) {
      enter.play();
    }
  // play only when mounted flips true
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const show = useCallback(() => {
    // Invalidate and stop any in-flight exit so a quick reopen does not unmount
    // after we have shown the element again.
    exitGen.current += 1;
    exit.cancel();
    setMounted(true);
  }, [exit]);

  const hide = useCallback(() => {
    const gen = (exitGen.current += 1);
    exit.play();
    exit.finished
      .then(() => {
        if (exitGen.current === gen) setMounted(false);
      })
      .catch(() => {/* cancelled */});
  }, [exit]);

  return {mounted, ref: elRef, show, hide};
}
