/**
 * Motion guide: all 8 canonical transition patterns with do/don't guidance.
 *
 * Patterns: nav-forward, nav-back, drill-in, drill-out, modal-enter,
 *           modal-exit, settle, cross-fade
 *
 * Rules:
 * - Compositor-only (transform, opacity). No layout-triggering props.
 * - reduced-motion: crossfade fallback, handled centrally.
 * - Interrupt-reversible: new key cancels the previous animation.
 */
import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {TransitionContainer} from '../../src/transitions/TransitionContainer';
import {Button} from '../../src/components/Button';

type PatternName = 'nav-forward' | 'nav-back' | 'drill-in' | 'drill-out' | 'modal-enter' | 'settle' | 'cross-fade';

const ALL_PATTERNS: PatternName[] = [
  'nav-forward', 'nav-back', 'drill-in', 'drill-out', 'modal-enter', 'settle', 'cross-fade',
];

const PATTERN_NOTES: Record<PatternName, {do: string; dont: string}> = {
  'nav-forward': {
    do: 'Use for advancing to a new route at the same level (breadcrumb forward, tab selection).',
    dont: 'Do NOT use when going back or returning to a parent context.',
  },
  'nav-back': {
    do: 'Use when navigating backward in browser history or dismissing a contextual view.',
    dont: 'Do NOT use when advancing -- it reverses the spatial model.',
  },
  'drill-in': {
    do: 'Use when diving into a child record (list row -> detail, card -> full page).',
    dont: 'Do NOT use for top-level route changes -- reserve for parent-to-child drill.',
  },
  'drill-out': {
    do: 'Use when returning from a detail page to a list. Pair with drill-in.',
    dont: 'Do NOT mix with nav-back for the same gesture.',
  },
  'modal-enter': {
    do: 'Use for dialogs, drawers, and overlays that occlude the page.',
    dont: 'Do NOT animate the page beneath -- only the overlay should move.',
  },
  'settle': {
    do: 'Use for content that resolves asynchronously in place (skeleton -> data, loading -> empty).',
    dont: 'Do NOT use for route changes; settle is for in-place state transitions.',
  },
  'cross-fade': {
    do: 'Use for simple content swaps where no spatial relationship exists.',
    dont: 'Do NOT use when a directional metaphor communicates hierarchy.',
  },
};

function PatternDemo({pattern}: {pattern: PatternName}): JSX.Element {
  const [key, setKey] = useState(0);
  const note = PATTERN_NOTES[pattern];

  return (
    <div style={{
      border: '1px solid var(--smd-border-default)',
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
    }}>
      <h3 style={{margin: '0 0 4px', fontFamily: 'monospace'}}>{pattern}</h3>
      <p style={{margin: '0 0 12px', fontSize: 12, color: 'var(--smd-text-tertiary)'}}>
        <strong>Do:</strong> {note.do}
      </p>
      <p style={{margin: '0 0 12px', fontSize: 12, color: 'var(--smd-text-tertiary)'}}>
        <strong>Do not:</strong> {note.dont}
      </p>
      <TransitionContainer locationKey={String(key)} pattern={pattern} style={{minHeight: 60}}>
        <div style={{
          padding: '12px 16px',
          background: 'var(--smd-bg-subtle)',
          borderRadius: 6,
          color: 'var(--smd-text-primary)',
        }}>
          Content version {key + 1}
        </div>
      </TransitionContainer>
      <Button variant="ghost" size="sm" style={{marginTop: 8}} onClick={() => setKey((k) => k + 1)}>
        Trigger transition
      </Button>
    </div>
  );
}

export const AllPatterns: Story = () => (
  <div style={{maxWidth: 640, margin: '0 auto', padding: 24}}>
    <h2 style={{marginBottom: 4}}>Motion: Canonical Transition Patterns</h2>
    <p style={{color: 'var(--smd-text-secondary)', marginBottom: 32, fontSize: 14}}>
      All animations are compositor-only (transform + opacity). Under
      prefers-reduced-motion, every pattern falls back to a simple cross-fade.
      Click "Trigger transition" to preview each pattern.
    </p>
    {ALL_PATTERNS.map((p) => <PatternDemo key={p} pattern={p} />)}
  </div>
);
AllPatterns.storyName = 'All Canonical Patterns';
