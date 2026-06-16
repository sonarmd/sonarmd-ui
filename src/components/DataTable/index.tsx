import React, {useMemo, useCallback, useRef} from 'react';
import {List, type RowComponentProps} from 'react-window';
import styles from './DataTable.module.css';
import {Skeleton} from '../Skeleton';

export interface Column<T = Record<string, unknown>> {
  key: string;
  header: string;
  width?: string | number;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selectedRows?: string[];
  compact?: boolean;
  stickyHeader?: boolean;
  className?: string;
}

function SortIcon({column, sortColumn, sortDirection}: {
  column: Column;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}): React.JSX.Element {
  const active = sortColumn === column.key;
  const upOpacity = active && sortDirection === 'asc' ? 1 : 0.3;
  const downOpacity = active && sortDirection === 'desc' ? 1 : 0.3;
  return (
    <span className={styles.sortIcon} aria-hidden="true">
      <svg width="8" height="11" viewBox="0 0 8 11" fill="currentColor">
        <path d="M4 0l3 4H1z" opacity={upOpacity} />
        <path d="M4 11l3-4H1z" opacity={downOpacity} />
      </svg>
    </span>
  );
}

// Props passed from List to each virtual row via rowProps
interface VirtualRowProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  selectedSet: Set<string>;
  isClickable: boolean;
  handleRowClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleRowKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  compact: boolean | undefined;
}

// The row component for react-window v2 List.
// Must be defined outside the main component to avoid becoming a new type every render.
function VirtualRowInner<T>(
  props: RowComponentProps<VirtualRowProps<T>>,
): React.JSX.Element {
  const {index, style, data, columns, keyExtractor, selectedSet, isClickable, handleRowClick, handleRowKeyDown} = props;
  const row = data[index];
  const key = keyExtractor(row);
  const isSelected = selectedSet.has(key);

  const rowClassName = [
    styles.tr,
    styles.trVirtual,
    isClickable ? styles.trClickable : undefined,
    isSelected ? styles.trSelected : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      role="row"
      style={style}
      className={rowClassName}
      data-row-key={key}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleRowClick : undefined}
      onKeyDown={isClickable ? handleRowKeyDown : undefined}
    >
      {columns.map((col) => {
        const rawValue = (row as Record<string, unknown>)[col.key];
        const cellContent = col.render
          ? col.render(rawValue, row, index)
          : (rawValue as React.ReactNode);
        return (
          <div
            role="cell"
            key={col.key}
            className={[
              styles.td,
              col.align === 'center' ? styles.alignCenter : undefined,
              col.align === 'right' ? styles.alignRight : undefined,
            ]
              .filter(Boolean)
              .join(' ')}
            style={col.width !== undefined ? {width: col.width, flexShrink: 0} : undefined}
          >
            {cellContent}
          </div>
        );
      })}
    </div>
  );
}

const ITEM_HEIGHT_NORMAL = 48;
const ITEM_HEIGHT_COMPACT = 36;
const VIRTUAL_THRESHOLD = 100;
const VIRTUAL_LIST_HEIGHT = 480;

export const DataTable = React.memo(function DataTable<T = Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  sortColumn,
  sortDirection,
  onSort,
  isLoading,
  emptyMessage = 'No data available',
  onRowClick,
  selectedRows,
  compact,
  stickyHeader,
  className,
}: DataTableProps<T>): React.JSX.Element {
  // Rule 6: non-render value for skeleton count
  const skeletonRowCount = useRef(0);
  skeletonRowCount.current = data.length > 0 ? data.length : 5;

  // --- Derived data structures (Rules 2 + 4) ---
  const rowsByKey = useMemo(
    () => new Map(data.map((row) => [keyExtractor(row), row])),
    [data, keyExtractor],
  );

  const selectedSet = useMemo(() => new Set(selectedRows ?? []), [selectedRows]);

  const wrapperClasses = useMemo(
    () =>
      [
        styles.wrapper,
        stickyHeader ? styles.stickyHeader : undefined,
        compact ? styles.compact : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' '),
    [stickyHeader, compact, className],
  );

  const shouldVirtualize = data.length > VIRTUAL_THRESHOLD;
  const itemHeight = compact ? ITEM_HEIGHT_COMPACT : ITEM_HEIGHT_NORMAL;
  const isClickable = Boolean(onRowClick);

  // --- Rule 7: data attribute handlers ---
  // Row click - reads data-row-key from the element (works for both tr and div)
  const handleRowClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!onRowClick) return;
      const key = (e.currentTarget as HTMLElement).dataset.rowKey;
      if (key == null) return;
      const row = rowsByKey.get(key);
      if (row) onRowClick(row);
    },
    [onRowClick, rowsByKey],
  );

  // Row keyboard handler - reads data-row-key from the element
  const handleRowKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!onRowClick) return;
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      const key = (e.currentTarget as HTMLElement).dataset.rowKey;
      if (key == null) return;
      const row = rowsByKey.get(key);
      if (row) onRowClick(row);
    },
    [onRowClick, rowsByKey],
  );

  // Sort click - reads data-col-key from the header cell (Rule 7)
  const handleSortClick = useCallback(
    (e: React.MouseEvent<HTMLTableCellElement>) => {
      if (!onSort) return;
      const colKey = e.currentTarget.dataset.colKey;
      if (!colKey) return;
      const newDir: 'asc' | 'desc' =
        sortColumn === colKey && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(colKey, newDir);
    },
    [onSort, sortColumn, sortDirection],
  );

  // Rule 2: stable rowProps object for react-window v2 - only recreated when deps change
  const virtualRowProps = useMemo<VirtualRowProps<T>>(
    () => ({
      data,
      columns,
      keyExtractor,
      selectedSet,
      isClickable,
      handleRowClick: handleRowClick as (e: React.MouseEvent<HTMLDivElement>) => void,
      handleRowKeyDown: handleRowKeyDown as (e: React.KeyboardEvent<HTMLDivElement>) => void,
      compact,
    }),
    [data, columns, keyExtractor, selectedSet, isClickable, handleRowClick, handleRowKeyDown, compact],
  );

  return (
    <div className={wrapperClasses}>
      <table className={styles.table} role={shouldVirtualize ? 'presentation' : undefined}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  styles.th,
                  col.sortable ? styles.thSortable : undefined,
                  col.align === 'center' ? styles.alignCenter : undefined,
                  col.align === 'right' ? styles.alignRight : undefined,
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={col.width !== undefined ? {width: col.width} : undefined}
                data-col-key={col.sortable ? col.key : undefined}
                onClick={col.sortable ? handleSortClick : undefined}
                aria-sort={
                  col.sortable
                    ? sortColumn === col.key
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                    : undefined
                }
              >
                {col.header}
                {col.sortable && (
                  <SortIcon
                    column={col as Column}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        {!shouldVirtualize && (
          <tbody>
            {isLoading ? (
              Array.from({length: skeletonRowCount.current}).map((_, rowIdx) => (
                <tr key={rowIdx} className={styles.tr}>
                  {columns.map((col) => (
                    <td key={col.key} className={styles.td}>
                      <Skeleton variant="text" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr className={styles.emptyRow}>
                <td colSpan={columns.length}>{emptyMessage}</td>
              </tr>
            ) : (
              data.map((row, rowIdx) => {
                const key = keyExtractor(row);
                const isSelected = selectedSet.has(key);
                return (
                  <tr
                    key={key}
                    className={[
                      styles.tr,
                      isClickable ? styles.trClickable : undefined,
                      isSelected ? styles.trSelected : undefined,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    role={isClickable ? 'button' : undefined}
                    tabIndex={isClickable ? 0 : undefined}
                    data-row-key={key}
                    onClick={isClickable ? (handleRowClick as (e: React.MouseEvent<HTMLTableRowElement>) => void) : undefined}
                    onKeyDown={isClickable ? (handleRowKeyDown as (e: React.KeyboardEvent<HTMLTableRowElement>) => void) : undefined}
                  >
                    {columns.map((col) => {
                      const rawValue = (row as Record<string, unknown>)[col.key];
                      const cellContent = col.render
                        ? col.render(rawValue, row, rowIdx)
                        : (rawValue as React.ReactNode);
                      return (
                        <td
                          key={col.key}
                          className={[
                            styles.td,
                            col.align === 'center' ? styles.alignCenter : undefined,
                            col.align === 'right' ? styles.alignRight : undefined,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        )}
      </table>
      {shouldVirtualize && (
        <div role="rowgroup">
          {isLoading ? (
            Array.from({length: skeletonRowCount.current}).map((_, rowIdx) => (
              <div
                key={rowIdx}
                role="row"
                className={styles.tr}
                style={{height: itemHeight, display: 'flex', alignItems: 'center'}}
              >
                {columns.map((col) => (
                  <div key={col.key} role="cell" className={styles.td}>
                    <Skeleton variant="text" />
                  </div>
                ))}
              </div>
            ))
          ) : data.length === 0 ? (
            <div role="row" className={styles.emptyRow}>
              <div role="cell">{emptyMessage}</div>
            </div>
          ) : (
            <List
              rowHeight={itemHeight}
              rowCount={data.length}
              rowComponent={VirtualRowInner as (props: RowComponentProps<VirtualRowProps<T>>) => React.JSX.Element}
              rowProps={virtualRowProps}
              style={{height: VIRTUAL_LIST_HEIGHT, overflowY: 'auto'}}
            />
          )}
        </div>
      )}
    </div>
  );
}) as <T = Record<string, unknown>>(props: DataTableProps<T>) => React.JSX.Element;
