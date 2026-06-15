export {useAnimate} from './useAnimate';
export type {AnimateOptions, AnimateControls} from './useAnimate';

export {usePresence} from './usePresence';
export type {PresenceOptions, PresenceControls} from './usePresence';

export {useFlip} from './useFlip';
export type {FlipOptions} from './useFlip';

// Motion token constants for JS consumers (mirrors --smd-duration-* / --smd-ease-*).
export const motionDuration = {
  instant: 0,
  fast:    120,
  base:    200,
  slow:    320,
  page:    400,
} as const;

export const motionEase = {
  standard:   'cubic-bezier(0.4, 0, 0.2, 1)',
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  springOut:  'linear(0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%, 0.849 31.5%, 0.937 38.1%, 0.987 44.7%, 1.014 50.8%, 1.021 53.5%, 1.021 55.2%, 1.017 57.6%, 1 65.5%, 0.996 70.3%, 1.001 86.3%, 1)',
} as const;
