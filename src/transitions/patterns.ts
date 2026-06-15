export type PatternName =
  | 'nav-forward'
  | 'nav-back'
  | 'resolve'
  | 'drill-in'
  | 'overlay'
  | 'swap'
  | 'settle'
  | 'dismiss';

export interface TransitionPattern {
  exitKeyframes: Keyframe[];
  enterKeyframes: Keyframe[];
  exitDuration: number;
  enterDuration: number;
  exitEasing: string;
  enterEasing: string;
}

const DECELERATE = 'cubic-bezier(0, 0, 0.2, 1)';
const STANDARD = 'cubic-bezier(0.4, 0, 0.2, 1)';
const ACCELERATE = 'cubic-bezier(0.4, 0, 1, 1)';

export const patterns: Record<PatternName, TransitionPattern> = {
  'nav-forward': {
    exitKeyframes:  [{transform: 'translateX(0)',    opacity: 1},   {transform: 'translateX(-24px)', opacity: 0.9}],
    enterKeyframes: [{transform: 'translateX(32px)', opacity: 0},   {transform: 'translateX(0)',     opacity: 1}],
    exitDuration:  200, enterDuration: 200,
    exitEasing: ACCELERATE, enterEasing: DECELERATE,
  },
  'nav-back': {
    exitKeyframes:  [{transform: 'translateX(0)',     opacity: 1},   {transform: 'translateX(32px)',  opacity: 0.9}],
    enterKeyframes: [{transform: 'translateX(-24px)', opacity: 0},   {transform: 'translateX(0)',     opacity: 1}],
    exitDuration:  200, enterDuration: 200,
    exitEasing: ACCELERATE, enterEasing: DECELERATE,
  },
  resolve: {
    exitKeyframes:  [{opacity: 1}, {opacity: 0, transform: 'scale(0.96)'}],
    enterKeyframes: [{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'translateY(0)'}],
    exitDuration:  120, enterDuration: 320,
    exitEasing: ACCELERATE, enterEasing: DECELERATE,
  },
  'drill-in': {
    exitKeyframes:  [{opacity: 1, transform: 'scale(1)'},    {opacity: 0, transform: 'scale(0.96)'}],
    enterKeyframes: [{opacity: 0, transform: 'scale(1.04)'}, {opacity: 1, transform: 'scale(1)'}],
    exitDuration:  200, enterDuration: 320,
    exitEasing: ACCELERATE, enterEasing: DECELERATE,
  },
  overlay: {
    exitKeyframes:  [{opacity: 1, transform: 'scale(1)'},    {opacity: 0, transform: 'scale(0.96)'}],
    enterKeyframes: [{opacity: 0, transform: 'scale(0.96)'}, {opacity: 1, transform: 'scale(1)'}],
    exitDuration:  120, enterDuration: 200,
    exitEasing: ACCELERATE, enterEasing: DECELERATE,
  },
  swap: {
    exitKeyframes:  [{opacity: 1}, {opacity: 0}],
    enterKeyframes: [{opacity: 0, transform: 'translateY(4px)'}, {opacity: 1, transform: 'translateY(0)'}],
    exitDuration:  200, enterDuration: 200,
    exitEasing: STANDARD, enterEasing: DECELERATE,
  },
  settle: {
    exitKeyframes:  [{opacity: 1}, {opacity: 0}],
    enterKeyframes: [{opacity: 0}, {opacity: 1}],
    exitDuration:  120, enterDuration: 320,
    exitEasing: STANDARD, enterEasing: DECELERATE,
  },
  dismiss: {
    exitKeyframes:  [{opacity: 1, transform: 'translateY(0)'}, {opacity: 0, transform: 'translateY(8px)'}],
    enterKeyframes: [{opacity: 0}, {opacity: 1}],
    exitDuration:  200, enterDuration: 120,
    exitEasing: ACCELERATE, enterEasing: DECELERATE,
  },
};

/** Fallback used when an unknown pattern name is provided (dev-mode warning only). */
export const DEFAULT_PATTERN: PatternName = 'swap';

const REDUCED_DURATION = 120;

export function reducedPattern(p: TransitionPattern): TransitionPattern {
  return {
    exitKeyframes:  [{opacity: 1}, {opacity: 0}],
    enterKeyframes: [{opacity: 0}, {opacity: 1}],
    exitDuration:  REDUCED_DURATION,
    enterDuration: REDUCED_DURATION,
    exitEasing:  p.exitEasing,
    enterEasing: p.enterEasing,
  };
}
