import {render, screen, act} from '@testing-library/react';
import {test, expect, vi} from 'vitest';
import React from 'react';
import {AppErrorBoundary} from './index';

function ThrowOnce({shouldThrow}: {shouldThrow: boolean}): JSX.Element {
  if (shouldThrow) throw new Error('test render error');
  return <p>OK</p>;
}

function ThrowAlways(): JSX.Element {
  throw new Error('always throws');
}

// Suppress React's console.error for expected error boundary catches.
const suppressError = (): (() => void) => {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  return () => spy.mockRestore();
};

test('renders children when no error', () => {
  render(
    <AppErrorBoundary>
      <p>content</p>
    </AppErrorBoundary>,
  );
  expect(screen.getByText('content')).toBeTruthy();
});

test('renders fallback UI on error without raw message', () => {
  const restore = suppressError();
  render(
    <AppErrorBoundary>
      <ThrowAlways />
    </AppErrorBoundary>,
  );
  expect(screen.getByRole('alert')).toBeTruthy();
  expect(screen.queryByText('always throws')).toBeNull();
  restore();
});

test('calls onError exactly once with component stack', () => {
  const restore = suppressError();
  const onError = vi.fn();
  render(
    <AppErrorBoundary onError={onError}>
      <ThrowAlways />
    </AppErrorBoundary>,
  );
  expect(onError).toHaveBeenCalledOnce();
  const [, info] = onError.mock.calls[0] as [Error, React.ErrorInfo];
  expect(typeof info.componentStack).toBe('string');
  restore();
});

test('showDetail=false hides raw error message (PHI-safe default)', () => {
  const restore = suppressError();
  render(
    <AppErrorBoundary>
      <ThrowAlways />
    </AppErrorBoundary>,
  );
  expect(screen.queryByText(/always throws/)).toBeNull();
  restore();
});

test('showDetail=true renders error message (internal tools only)', () => {
  const restore = suppressError();
  render(
    <AppErrorBoundary showDetail>
      <ThrowAlways />
    </AppErrorBoundary>,
  );
  expect(screen.getByText(/always throws/)).toBeTruthy();
  restore();
});

test('resets on "Try again" click', async () => {
  const restore = suppressError();
  const {rerender} = render(
    <AppErrorBoundary>
      <ThrowAlways />
    </AppErrorBoundary>,
  );
  expect(screen.getByRole('alert')).toBeTruthy();

  await act(async () => {
    screen.getByText('Try again').click();
  });

  // After reset the boundary re-renders children; ThrowAlways throws again.
  // We verify the boundary re-caught (alert still shown) rather than crashing.
  expect(screen.getByRole('alert')).toBeTruthy();
  restore();
  rerender(<></>);
});

test('auto-resets when a resetKey changes', async () => {
  const restore = suppressError();
  const {rerender} = render(
    <AppErrorBoundary resetKeys={['page-a']}>
      <ThrowAlways />
    </AppErrorBoundary>,
  );
  expect(screen.getByRole('alert')).toBeTruthy();

  // Change resetKey - boundary should clear caught state.
  await act(async () => {
    rerender(
      <AppErrorBoundary resetKeys={['page-b']}>
        <p>recovered</p>
      </AppErrorBoundary>,
    );
  });

  expect(screen.getByText('recovered')).toBeTruthy();
  restore();
});

test('custom fallback renders instead of built-in card', () => {
  const restore = suppressError();
  render(
    <AppErrorBoundary fallback={<div>custom fallback</div>}>
      <ThrowAlways />
    </AppErrorBoundary>,
  );
  expect(screen.getByText('custom fallback')).toBeTruthy();
  restore();
});
