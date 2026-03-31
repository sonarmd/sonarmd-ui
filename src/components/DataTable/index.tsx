import React from 'react';
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
}): JSX.Element {
  if (sortColumn === column.key) {
    return <span className={styles.sortIcon}>{sortDirection === 'asc' ? '▲' : '▼'}</span>;
  }
  return <span className={styles.sortIcon} style={{opacity: 0.3}}>▲▼</span>;
}

export function DataTable<T = Record<string, unknown>>({
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
}: DataTableProps<T>): JSX.Element {
  const handleSort = (col: Column<T>): void => {
    if (!col.sortable || !onSort) return;
    const nextDir: 'asc' | 'desc' =
      sortColumn === col.key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(col.key, nextDir);
  };

  const handleRowKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>, row: T): void => {
    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onRowClick(row);
    }
  };

  const skeletonRowCount = data.length > 0 ? data.length : 5;

  const wrapperClasses = [
    styles.wrapper,
    stickyHeader ? styles.stickyHeader : undefined,
    compact ? styles.compact : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      <table className={styles.table}>
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
                onClick={col.sortable ? () => handleSort(col) : undefined}
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
        <tbody>
          {isLoading ? (
            Array.from({length: skeletonRowCount}).map((_, rowIdx) => (
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
              const isSelected = selectedRows?.includes(key);
              const isClickable = Boolean(onRowClick);
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
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={isClickable ? (e) => handleRowKeyDown(e, row) : undefined}
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
      </table>
    </div>
  );
}
