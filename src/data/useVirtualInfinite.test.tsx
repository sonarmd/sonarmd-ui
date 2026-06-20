import React from 'react';
/**
 * The windowed infinite-scroll trigger: fires onLoadMore as the rendered range
 * nears the end, guarded by hasNext and not-already-loading, and adds a trailing
 * loader row only while another page exists.
 */
import {renderHook} from '@testing-library/react';
import {test, expect, vi} from 'vitest';
import {useVirtualInfinite} from './useVirtualInfinite';

test('rowCount adds one loader row only while hasNext', () => {
  const {result, rerender} = renderHook(
    ({hasNext}) =>
      useVirtualInfinite({itemCount: 20, hasNext, isLoadingNext: false, onLoadMore: () => {}}),
    {initialProps: {hasNext: true}},
  );
  expect(result.current.rowCount).toBe(21);
  expect(result.current.isLoaderRow(20)).toBe(true);
  expect(result.current.isLoaderRow(19)).toBe(false);

  rerender({hasNext: false});
  expect(result.current.rowCount).toBe(20);
});

test('loads the next page when the last visible row is within the threshold', () => {
  const onLoadMore = vi.fn();
  const {result} = renderHook(() =>
    useVirtualInfinite({itemCount: 100, hasNext: true, isLoadingNext: false, onLoadMore, thresholdRows: 8}),
  );
  // Far from the end: no load.
  result.current.onRowsRendered({startIndex: 0, stopIndex: 50});
  expect(onLoadMore).not.toHaveBeenCalled();
  // Within 8 of the end (>= 92): load.
  result.current.onRowsRendered({startIndex: 80, stopIndex: 93});
  expect(onLoadMore).toHaveBeenCalledTimes(1);
});

test('latches: repeated near-end ranges at the same itemCount load only once', () => {
  const onLoadMore = vi.fn();
  const {result, rerender} = renderHook(
    ({itemCount}) =>
      useVirtualInfinite({itemCount, hasNext: true, isLoadingNext: false, onLoadMore, thresholdRows: 8}),
    {initialProps: {itemCount: 100}},
  );
  // Several near-end notifications before the parent flips isLoadingNext - still one load.
  result.current.onRowsRendered({startIndex: 80, stopIndex: 95});
  result.current.onRowsRendered({startIndex: 81, stopIndex: 96});
  result.current.onRowsRendered({startIndex: 82, stopIndex: 99});
  expect(onLoadMore).toHaveBeenCalledTimes(1);

  // Once the next page actually arrives (itemCount grows), the latch releases.
  rerender({itemCount: 125});
  result.current.onRowsRendered({startIndex: 110, stopIndex: 124});
  expect(onLoadMore).toHaveBeenCalledTimes(2);
});

test('does not load while a page is already loading or when none remains', () => {
  const onLoadMore = vi.fn();
  const {result, rerender} = renderHook(
    ({isLoadingNext, hasNext}) =>
      useVirtualInfinite({itemCount: 100, hasNext, isLoadingNext, onLoadMore, thresholdRows: 8}),
    {initialProps: {isLoadingNext: true, hasNext: true}},
  );
  result.current.onRowsRendered({startIndex: 80, stopIndex: 99});
  expect(onLoadMore).not.toHaveBeenCalled();

  rerender({isLoadingNext: false, hasNext: false});
  result.current.onRowsRendered({startIndex: 80, stopIndex: 99});
  expect(onLoadMore).not.toHaveBeenCalled();
});
