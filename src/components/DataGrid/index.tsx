import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {List, type RowComponentProps} from 'react-window';
import {useVirtualInfinite} from '../../data/useVirtualInfinite';
import {Pagination} from '../Pagination';
import styles from './DataGrid.module.css';

export interface DataGridColumn<T = Record<string, unknown>> {
  /** Row field read when `render` is not given; also the column identity. */
  key: string;
  /** Header label. */
  header: string;
  /** Starting width in px. Unset -> shares the leftover container width. */
  width?: number;
  /** Lower resize bound in px. Default 64. */
  minWidth?: number;
  /** Cell alignment. Default left. */
  align?: 'left' | 'center' | 'right';
  /** Renders a sort control in the header; the grid calls `onSort`. */
  sortable?: boolean;
  /** Opt this column out of resizing. Default resizable. */
  resizable?: boolean;
  /** Custom cell renderer. */
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface DataGridPagination {
  /** Current page, 1-based. */
  page: number;
  /** Total number of pages (>= 1). */
  pageCount: number;
  onPageChange: (page: number) => void;
}

export interface DataGridInfinite {
  /** Whether another page exists to load. */
  hasNext: boolean;
  /** Whether the next page is already in flight. */
  isLoadingNext: boolean;
  /** Load the next page; called as scrolling nears the end. */
  onLoadMore: () => void;
}

export interface DataGridProps<T = Record<string, unknown>> {
  columns: DataGridColumn<T>[];
  /** Loaded rows. In infinite mode, append as pages arrive. */
  rows: T[];
  keyExtractor: (row: T) => string;
  /** Fixed row height in px (windowing requires a known height). Default 48. */
  rowHeight?: number;
  /** Body viewport height in px. Default 400. */
  height?: number;
  /** Paged mode: renders `Pagination` under the grid. Mutually exclusive with `infinite`. */
  pagination?: DataGridPagination;
  /** Infinite mode: virtualized lazy loading as the user scrolls. Mutually exclusive with `pagination`. */
  infinite?: DataGridInfinite;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
  /** Master switch for drag/keyboard column resizing. Default true. */
  resizableColumns?: boolean;
  /** Shown when there are no rows and nothing more to load. */
  emptyState?: React.ReactNode;
  /** Custom trailing row while the next page loads (infinite mode). */
  loadingRow?: React.ReactNode;
  /** Rows kept mounted beyond the visible range, each side. Default 6. */
  overscanCount?: number;
  /** Rows from the end at which to start loading the next page. Default 8. */
  thresholdRows?: number;
  /** Accessible name for the grid. */
  ariaLabel?: string;
  className?: string;
}

const MIN_WIDTH_DEFAULT = 64;
const MAX_WIDTH = 800;
const RESIZE_STEP = 16;
const ROW_HEIGHT_DEFAULT = 48;
const HEIGHT_DEFAULT = 400;

/**
 * Container-driven width distribution. Fixed columns (explicit `width` or a
 * user resize) keep their px; the leftover container width is shared equally
 * among the auto columns, floored at each column's minWidth. Re-runs on
 * container resize, so auto columns stay responsive while resized ones persist.
 */
function distributeWidths(
  columns: ReadonlyArray<{key: string; width?: number; minWidth?: number}>,
  containerWidth: number,
  overrides: ReadonlyMap<string, number>,
): number[] {
  const fixed = columns.map((c) => overrides.get(c.key) ?? c.width ?? null);
  const fixedSum = fixed.reduce<number>((sum, w) => sum + (w ?? 0), 0);
  const autoCount = fixed.filter((w) => w == null).length;
  const share = autoCount > 0 ? Math.floor(Math.max(0, containerWidth - fixedSum) / autoCount) : 0;
  return columns.map((c, i) => {
    const min = c.minWidth ?? MIN_WIDTH_DEFAULT;
    return Math.max(min, fixed[i] ?? share);
  });
}

function cellAlignClass(align: 'left' | 'center' | 'right' | undefined): string | undefined {
  if (align === 'center') return styles.alignCenter;
  if (align === 'right') return styles.alignRight;
  return undefined;
}

function SortIcon({active, direction}: {active: boolean; direction?: 'asc' | 'desc'}): React.JSX.Element {
  return (
    <span className={styles.sortIcon} aria-hidden="true">
      <svg width="8" height="11" viewBox="0 0 8 11" fill="currentColor">
        <path d="M4 0l3 4H1z" opacity={active && direction === 'asc' ? 1 : 0.3} />
        <path d="M4 11l3-4H1z" opacity={active && direction === 'desc' ? 1 : 0.3} />
      </svg>
    </span>
  );
}

interface GridRowProps<T> {
  rows: T[];
  columns: DataGridColumn<T>[];
  widths: number[];
  totalWidth: number;
  keyExtractor: (row: T) => string;
  isClickable: boolean;
  handleRowClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleRowKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  isLoaderRow: (index: number) => boolean;
  loadingRow: React.ReactNode;
}

// Defined outside the component so its identity is stable across renders
// (react-window re-mounts rows if the row component type changes).
function GridRowInner<T>({
  index,
  style,
  rows,
  columns,
  widths,
  totalWidth,
  keyExtractor,
  isClickable,
  handleRowClick,
  handleRowKeyDown,
  isLoaderRow,
  loadingRow,
}: RowComponentProps<GridRowProps<T>>): React.JSX.Element {
  if (isLoaderRow(index)) {
    // Visible loading state; announced via the live region, so hidden from
    // the accessibility tree to avoid an empty phantom row.
    return (
      <div style={{...style, width: totalWidth}} className={styles.loaderRow} aria-hidden="true">
        {loadingRow ?? <span className={styles.spinner} />}
      </div>
    );
  }
  const row = rows[index];
  const key = keyExtractor(row);
  const rowClass = [styles.row, isClickable ? styles.rowClickable : undefined]
    .filter(Boolean)
    .join(' ');
  return (
    <div
      style={{...style, width: totalWidth}}
      className={rowClass}
      data-row-key={key}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleRowClick : undefined}
      onKeyDown={isClickable ? handleRowKeyDown : undefined}
    >
      {columns.map((col, i) => {
        const raw = (row as Record<string, unknown>)[col.key];
        const cellClass = [styles.cell, cellAlignClass(col.align)].filter(Boolean).join(' ');
        return (
          <div key={col.key} className={cellClass} style={{width: widths[i], flexShrink: 0}}>
            {col.render ? col.render(raw, row, index) : (raw as React.ReactNode)}
          </div>
        );
      })}
    </div>
  );
}

/**
 * A dynamic table for large or remote data sets: always-virtualized rows
 * (react-window keeps only the visible window in the DOM), lazy loading with
 * infinite scroll (`infinite`) OR classic paging (`pagination`), automatic
 * container-driven column sizing with drag + keyboard column resizing, and a
 * header that stays pinned while the body scrolls.
 *
 * The header lives outside the virtualized vertical scroller, so it is pinned
 * by construction; both share one horizontal scroller so columns stay aligned.
 * Rows/cells carry no table ARIA roles: react-window's sizing element cannot
 * satisfy the grid role's required-children contract (same trade-off as
 * InfiniteList, documented there); the wrapper is a labelled group and loading
 * progress is announced through a polite live region. Sort and resize are real
 * focusable controls (button / separator with value semantics).
 *
 * For small, fully-loaded tables prefer `DataTable`.
 */
function DataGridInner<T = Record<string, unknown>>({
  columns,
  rows,
  keyExtractor,
  rowHeight = ROW_HEIGHT_DEFAULT,
  height = HEIGHT_DEFAULT,
  pagination,
  infinite,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  resizableColumns = true,
  emptyState,
  loadingRow,
  overscanCount = 6,
  thresholdRows = 8,
  ariaLabel,
  className,
}: DataGridProps<T>): React.JSX.Element {
  if (pagination && infinite) {
    throw new Error('DataGrid: `pagination` and `infinite` are mutually exclusive - pass one.');
  }

  // --- Column widths -----------------------------------------------------
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [overrides, setOverrides] = useState<ReadonlyMap<string, number>>(new Map());

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    setContainerWidth(el.offsetWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width !== undefined) setContainerWidth(Math.floor(width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const widths = useMemo(
    () => distributeWidths(columns, containerWidth, overrides),
    [columns, containerWidth, overrides],
  );
  const totalWidth = useMemo(
    () => Math.max(widths.reduce((sum, w) => sum + w, 0), containerWidth),
    [widths, containerWidth],
  );

  const clampWidth = useCallback(
    (key: string, width: number) => {
      const col = columns.find((c) => c.key === key);
      const min = col?.minWidth ?? MIN_WIDTH_DEFAULT;
      return Math.min(MAX_WIDTH, Math.max(min, Math.round(width)));
    },
    [columns],
  );

  const setOverride = useCallback(
    (key: string, width: number) => {
      setOverrides((prev) => {
        const next = new Map(prev);
        next.set(key, clampWidth(key, width));
        return next;
      });
    },
    [clampWidth],
  );

  // --- Resize handles (pointer drag + keyboard) ---------------------------
  const dragRef = useRef<{key: string; startX: number; startWidth: number} | null>(null);

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const key = e.currentTarget.dataset.colKey;
      if (!key) return;
      const index = columns.findIndex((c) => c.key === key);
      if (index < 0) return;
      dragRef.current = {key, startX: e.clientX, startWidth: widths[index]};
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [columns, widths],
  );

  const handleResizePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      setOverride(drag.key, drag.startWidth + (e.clientX - drag.startX));
    },
    [setOverride],
  );

  const handleResizePointerEnd = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleResizeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const key = e.currentTarget.dataset.colKey;
      if (!key) return;
      const index = columns.findIndex((c) => c.key === key);
      if (index < 0) return;
      const min = columns[index].minWidth ?? MIN_WIDTH_DEFAULT;
      let next: number | null = null;
      if (e.key === 'ArrowLeft') next = widths[index] - RESIZE_STEP;
      else if (e.key === 'ArrowRight') next = widths[index] + RESIZE_STEP;
      else if (e.key === 'Home') next = min;
      else if (e.key === 'End') next = MAX_WIDTH;
      if (next == null) return;
      e.preventDefault();
      setOverride(key, next);
    },
    [columns, widths, setOverride],
  );

  // --- Sort + row interaction ---------------------------------------------
  const handleSortClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!onSort) return;
      const colKey = e.currentTarget.dataset.colKey;
      if (!colKey) return;
      const nextDirection: 'asc' | 'desc' =
        sortColumn === colKey && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(colKey, nextDirection);
    },
    [onSort, sortColumn, sortDirection],
  );

  const rowsByKey = useMemo(
    () => new Map(rows.map((row) => [keyExtractor(row), row])),
    [rows, keyExtractor],
  );
  const isClickable = Boolean(onRowClick);

  const handleRowClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!onRowClick) return;
      const key = e.currentTarget.dataset.rowKey;
      if (key == null) return;
      const row = rowsByKey.get(key);
      if (row) onRowClick(row);
    },
    [onRowClick, rowsByKey],
  );

  const handleRowKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onRowClick) return;
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      const key = e.currentTarget.dataset.rowKey;
      if (key == null) return;
      const row = rowsByKey.get(key);
      if (row) onRowClick(row);
    },
    [onRowClick, rowsByKey],
  );

  // --- Virtualized body (one render path for all modes) -------------------
  const noopLoadMore = useCallback(() => undefined, []);
  const {rowCount, onRowsRendered, isLoaderRow} = useVirtualInfinite({
    itemCount: rows.length,
    hasNext: infinite?.hasNext ?? false,
    isLoadingNext: infinite?.isLoadingNext ?? false,
    onLoadMore: infinite?.onLoadMore ?? noopLoadMore,
    thresholdRows,
  });

  const rowProps = useMemo<GridRowProps<T>>(
    () => ({
      rows,
      columns,
      widths,
      totalWidth,
      keyExtractor,
      isClickable,
      handleRowClick,
      handleRowKeyDown,
      isLoaderRow,
      loadingRow,
    }),
    [rows, columns, widths, totalWidth, keyExtractor, isClickable, handleRowClick, handleRowKeyDown, isLoaderRow, loadingRow],
  );

  const RowComponent = useCallback(
    (props: RowComponentProps<GridRowProps<T>>) => <GridRowInner<T> {...props} />,
    [],
  );

  const wrapperClass = [styles.wrapper, className].filter(Boolean).join(' ');
  const isEmpty = rows.length === 0 && !(infinite?.hasNext ?? false);
  const isLoadingNext = infinite?.isLoadingNext ?? false;

  return (
    <div ref={wrapperRef} className={wrapperClass}>
      {/* role="group": react-window's sizing element cannot satisfy the grid
          role's required-children, so no table ARIA inside (see JSDoc). */}
      <div
        className={styles.scroller}
        role="group"
        aria-label={ariaLabel}
        aria-busy={isLoadingNext || undefined}
      >
        <div className={styles.header} style={{width: totalWidth}}>
          {columns.map((col, i) => {
            const headerCellClass = [styles.headerCell, cellAlignClass(col.align)]
              .filter(Boolean)
              .join(' ');
            const sortActive = sortColumn === col.key;
            const sortState = sortActive
              ? sortDirection === 'asc'
                ? ', sorted ascending'
                : ', sorted descending'
              : '';
            const canResize = resizableColumns && col.resizable !== false;
            return (
              <div key={col.key} className={headerCellClass} style={{width: widths[i], flexShrink: 0}}>
                {col.sortable && onSort ? (
                  <button
                    type="button"
                    className={styles.sortButton}
                    data-col-key={col.key}
                    onClick={handleSortClick}
                    aria-label={`Sort by ${col.header}${sortState}`}
                  >
                    <span className={styles.headerLabel}>{col.header}</span>
                    <SortIcon active={sortActive} direction={sortDirection} />
                  </button>
                ) : (
                  <span className={styles.headerLabel}>{col.header}</span>
                )}
                {canResize && (
                  <div
                    role="separator"
                    aria-orientation="vertical"
                    aria-label={`Resize ${col.header} column`}
                    aria-valuemin={col.minWidth ?? MIN_WIDTH_DEFAULT}
                    aria-valuemax={MAX_WIDTH}
                    aria-valuenow={widths[i]}
                    tabIndex={0}
                    data-col-key={col.key}
                    className={styles.resizeHandle}
                    onPointerDown={handleResizePointerDown}
                    onPointerMove={handleResizePointerMove}
                    onPointerUp={handleResizePointerEnd}
                    onPointerCancel={handleResizePointerEnd}
                    onKeyDown={handleResizeKeyDown}
                  />
                )}
              </div>
            );
          })}
        </div>
        {isEmpty ? (
          <div className={styles.emptyState} style={{height}}>
            {emptyState ?? 'No rows'}
          </div>
        ) : (
          <List
            rowHeight={rowHeight}
            rowCount={rowCount}
            rowComponent={RowComponent}
            rowProps={rowProps}
            onRowsRendered={infinite ? onRowsRendered : undefined}
            overscanCount={overscanCount}
            style={{height, overflowY: 'auto', width: totalWidth}}
          />
        )}
        <span className={styles.srOnly} role="status" aria-live="polite">
          {isLoadingNext ? 'Loading more rows' : `${rows.length} rows`}
        </span>
      </div>
      {pagination && (
        <div className={styles.paginationBar}>
          <Pagination
            page={pagination.page}
            pageCount={pagination.pageCount}
            onPageChange={pagination.onPageChange}
            size="sm"
          />
        </div>
      )}
    </div>
  );
}

export const DataGrid = DataGridInner as <T = Record<string, unknown>>(
  props: DataGridProps<T>,
) => React.JSX.Element;
