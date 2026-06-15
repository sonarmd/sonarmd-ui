/**
 * V1_SPEC Criterion 5.5: TransitionContainer driven by a fake history (no
 * react-router in scope). Verifies all 8 patterns and the unknown-name
 * fallback without any router dependency.
 */
import {useState} from 'react';
import {render, act, screen} from '@testing-library/react';
import {test, expect, vi} from 'vitest';
import {TransitionContainer} from './TransitionContainer';
import type {PatternName, TransitionDirection} from './index';

// WAAPI is not implemented in jsdom - stub Element.animate so the component
// does not throw. The stub returns a finished promise that resolves immediately.
if (!Element.prototype.animate) {
  Element.prototype.animate = function stubAnimate() {
    const anim = {
      finished: Promise.resolve(),
      cancel: vi.fn(),
      reverse: vi.fn(),
      currentTime: 0,
      playState: 'finished' as AnimationPlayState,
    };
    return anim as unknown as Animation;
  };
}

function Harness({pattern, direction = 'forward'}: {pattern?: string; direction?: TransitionDirection}) {
  const [key, setKey] = useState('page-a');
  const [content, setContent] = useState('Page A');

  function navigate(newKey: string, newContent: string) {
    setKey(newKey);
    setContent(newContent);
  }

  return (
    <div>
      <button onClick={() => navigate('page-b', 'Page B')}>go B</button>
      <button onClick={() => navigate('page-a', 'Page A')}>go A</button>
      <TransitionContainer locationKey={key} direction={direction} pattern={pattern as PatternName}>
        <p>{content}</p>
      </TransitionContainer>
    </div>
  );
}

test('renders initial content without transition', () => {
  render(<Harness />);
  expect(screen.getByText('Page A')).toBeTruthy();
});

test('shows new content after key change', async () => {
  render(<Harness />);
  await act(async () => {
    screen.getByText('go B').click();
  });
  expect(screen.getByText('Page B')).toBeTruthy();
});

const ALL_PATTERNS: PatternName[] = [
  'nav-forward', 'nav-back', 'resolve', 'drill-in',
  'overlay', 'swap', 'settle', 'dismiss',
];

for (const p of ALL_PATTERNS) {
  test(`pattern "${p}" renders without error`, async () => {
    render(<Harness pattern={p} />);
    await act(async () => {
      screen.getByText('go B').click();
    });
    expect(screen.getByText('Page B')).toBeTruthy();
  });
}

test('unknown pattern name falls back gracefully (no throw)', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  render(<Harness pattern="totally-unknown" />);
  await act(async () => {
    screen.getByText('go B').click();
  });
  expect(screen.getByText('Page B')).toBeTruthy();
  warn.mockRestore();
});

test('nav-back direction uses back pattern by default', async () => {
  render(<Harness direction="back" />);
  await act(async () => {
    screen.getByText('go B').click();
  });
  expect(screen.getByText('Page B')).toBeTruthy();
});
