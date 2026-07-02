import React from 'react';
/**
 * Behavioral coverage the static fixtures harness cannot exercise: sort
 * toggling, keyboard column resize, mode wiring (pagination / infinite), and
 * the mutual-exclusion guard.
 */
import {render, screen, fireEvent} from '@testing-library/react';
import {describe, test, expect, vi} from 'vitest';
import {DataGrid} from './index';

const columns = [
  {key: 'name', header: 'Name', sortable: true},
  {key: 'score', header: 'Score', width: 120},
];
const rows = Array.from({length: 5}, (_, i) => ({
  id: String(i + 1),
  name: `Row ${i + 1}`,
  score: i * 10,
}));
const keyExtractor = (r: {id: string}): string => r.id;
const noop = (): void => {};

describe('DataGrid', () => {
  test('renders header labels and announces the row count', () => {
    render(<DataGrid columns={columns} rows={rows} keyExtractor={keyExtractor} ariaLabel="Rows" />);
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByText('Score')).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('5 rows');
    expect(screen.getByRole('group', {name: 'Rows'})).toBeTruthy();
  });

  test('sort button toggles asc -> desc via onSort', () => {
    const onSort = vi.fn();
    const {rerender} = render(
      <DataGrid columns={columns} rows={rows} keyExtractor={keyExtractor} onSort={onSort} />,
    );
    fireEvent.click(screen.getByRole('button', {name: 'Sort by Name'}));
    expect(onSort).toHaveBeenCalledWith('name', 'asc');

    rerender(
      <DataGrid
        columns={columns}
        rows={rows}
        keyExtractor={keyExtractor}
        onSort={onSort}
        sortColumn="name"
        sortDirection="asc"
      />,
    );
    fireEvent.click(screen.getByRole('button', {name: 'Sort by Name, sorted ascending'}));
    expect(onSort).toHaveBeenLastCalledWith('name', 'desc');
  });

  test('keyboard resize moves the separator value by one step and Home returns to min', () => {
    render(<DataGrid columns={columns} rows={rows} keyExtractor={keyExtractor} />);
    const handle = screen.getByRole('separator', {name: 'Resize Score column'});
    const before = Number(handle.getAttribute('aria-valuenow'));
    fireEvent.keyDown(handle, {key: 'ArrowRight'});
    expect(Number(handle.getAttribute('aria-valuenow'))).toBe(before + 16);
    fireEvent.keyDown(handle, {key: 'Home'});
    expect(Number(handle.getAttribute('aria-valuenow'))).toBe(64);
  });

  test('resizableColumns={false} renders no separators', () => {
    render(
      <DataGrid columns={columns} rows={rows} keyExtractor={keyExtractor} resizableColumns={false} />,
    );
    expect(screen.queryByRole('separator')).toBeNull();
  });

  test('pagination mode renders the nav and forwards page changes', () => {
    const onPageChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        keyExtractor={keyExtractor}
        pagination={{page: 2, pageCount: 4, onPageChange}}
      />,
    );
    fireEvent.click(screen.getByRole('button', {name: /next/i}));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test('infinite mode announces loading through the live region and sets aria-busy', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        keyExtractor={keyExtractor}
        ariaLabel="Rows"
        infinite={{hasNext: true, isLoadingNext: true, onLoadMore: noop}}
      />,
    );
    expect(screen.getByRole('status').textContent).toBe('Loading more rows');
    expect(screen.getByRole('group', {name: 'Rows'}).getAttribute('aria-busy')).toBe('true');
  });

  test('empty state renders when there are no rows and nothing more to load', () => {
    render(
      <DataGrid columns={columns} rows={[]} keyExtractor={keyExtractor} emptyState="Nothing here" />,
    );
    expect(screen.getByText('Nothing here')).toBeTruthy();
  });

  test('passing both pagination and infinite throws', () => {
    // Silence React's error-boundary noise for the expected throw.
    const spy = vi.spyOn(console, 'error').mockImplementation(noop);
    expect(() =>
      render(
        <DataGrid
          columns={columns}
          rows={rows}
          keyExtractor={keyExtractor}
          pagination={{page: 1, pageCount: 1, onPageChange: noop}}
          infinite={{hasNext: false, isLoadingNext: false, onLoadMore: noop}}
        />,
      ),
    ).toThrow(/mutually exclusive/);
    spy.mockRestore();
  });
});
