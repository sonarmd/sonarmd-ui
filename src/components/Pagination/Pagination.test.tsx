import React from 'react';
/**
 * Behavioral coverage for page navigation: current-page marking, bound-disabled
 * prev/next, and the page-change callback. The static harness only snapshots one
 * page state.
 */
import {useState} from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import {test, expect} from 'vitest';
import {Pagination} from './index';

function Harness({initial = 1, pageCount = 10}: {initial?: number; pageCount?: number}): React.JSX.Element {
  const [page, setPage] = useState(initial);
  return <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />;
}

test('current page is marked with aria-current and lives in a nav landmark', () => {
  render(<Harness initial={3} />);
  const nav = screen.getByRole('navigation', {name: 'Pagination'});
  expect(nav).toBeTruthy();
  const current = screen.getByRole('button', {name: 'Page 3'});
  expect(current.getAttribute('aria-current')).toBe('page');
});

test('previous is disabled on the first page, next on the last', () => {
  const {unmount} = render(<Harness initial={1} pageCount={5} />);
  expect((screen.getByRole('button', {name: 'Previous page'}) as HTMLButtonElement).disabled).toBe(true);
  expect((screen.getByRole('button', {name: 'Next page'}) as HTMLButtonElement).disabled).toBe(false);
  unmount();

  render(<Harness initial={5} pageCount={5} />);
  expect((screen.getByRole('button', {name: 'Next page'}) as HTMLButtonElement).disabled).toBe(true);
});

test('boundaryCount=0 still renders the current page (no NaN window collapse)', () => {
  const noop = (): void => {};
  render(<Pagination page={5} pageCount={10} boundaryCount={0} onPageChange={noop} />);
  const current = screen.getByRole('button', {name: 'Page 5'});
  expect(current.getAttribute('aria-current')).toBe('page');
});

test('clicking a page and Next moves the current page', () => {
  render(<Harness initial={1} pageCount={10} />);
  fireEvent.click(screen.getByRole('button', {name: 'Page 2'}));
  expect(screen.getByRole('button', {name: 'Page 2'}).getAttribute('aria-current')).toBe('page');

  fireEvent.click(screen.getByRole('button', {name: 'Next page'}));
  expect(screen.getByRole('button', {name: 'Page 3'}).getAttribute('aria-current')).toBe('page');
});
