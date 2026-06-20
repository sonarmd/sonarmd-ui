import React from 'react';
/**
 * The basic sentinel infinite-scroll hook: when the sentinel intersects, load
 * the next page - but only when one exists and isn't already loading - and
 * disconnect the observer on unmount.
 */
import {render} from '@testing-library/react';
import {test, expect, vi, beforeEach, afterEach} from 'vitest';
import {useInfiniteScroll} from './useInfiniteScroll';

interface MockObserver {
  cb: (entries: {isIntersecting: boolean}[]) => void;
  disconnected: boolean;
  trigger: (isIntersecting: boolean) => void;
}

let observers: MockObserver[] = [];

class MockIntersectionObserver {
  private readonly observer: MockObserver;
  constructor(cb: (entries: {isIntersecting: boolean}[]) => void) {
    this.observer = {
      cb,
      disconnected: false,
      trigger: (isIntersecting: boolean) => cb([{isIntersecting}]),
    };
    observers.push(this.observer);
  }
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {
    this.observer.disconnected = true;
  }
}

beforeEach(() => {
  observers = [];
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});
afterEach(() => vi.unstubAllGlobals());

function ListEnd(props: {hasNext: boolean; isLoadingNext: boolean; onLoadMore: () => void}): React.JSX.Element {
  const {sentinelRef} = useInfiniteScroll(props);
  return <div data-testid="sentinel" ref={sentinelRef} />;
}

test('loads more when the sentinel intersects and a page is available', () => {
  const onLoadMore = vi.fn();
  render(<ListEnd hasNext isLoadingNext={false} onLoadMore={onLoadMore} />);
  expect(observers).toHaveLength(1);
  observers[0].trigger(true);
  expect(onLoadMore).toHaveBeenCalledTimes(1);
});

test('does not load while already loading or when no page remains', () => {
  const onLoadMore = vi.fn();
  const {rerender} = render(<ListEnd hasNext isLoadingNext onLoadMore={onLoadMore} />);
  observers[0].trigger(true);
  expect(onLoadMore).not.toHaveBeenCalled();

  rerender(<ListEnd hasNext={false} isLoadingNext={false} onLoadMore={onLoadMore} />);
  observers[0].trigger(true);
  expect(onLoadMore).not.toHaveBeenCalled();
});

test('disconnects the observer on unmount', () => {
  const {unmount} = render(<ListEnd hasNext isLoadingNext={false} onLoadMore={() => {}} />);
  expect(observers[0].disconnected).toBe(false);
  unmount();
  expect(observers[0].disconnected).toBe(true);
});
