import React, {useCallback, useMemo} from 'react';
import {List, type RowComponentProps} from 'react-window';
import {useVirtualInfinite} from '../../data/useVirtualInfinite';
import styles from './InfiniteList.module.css';

export interface InfiniteListProps<T> {
  /** Currently loaded items. Append to this as pages arrive. */
  items: T[];
  /** Fixed row height in px (windowing requires a known row height). */
  rowHeight: number;
  /** Render one item. The element is positioned by the list; do not add margins. */
  renderRow: (item: T, index: number) => React.ReactNode;
  /** Whether another page exists to load. */
  hasNext: boolean;
  /** Whether the next page is already loading (prevents duplicate fetches). */
  isLoadingNext: boolean;
  /** Load the next page; called as the rendered range nears the end. */
  onLoadMore: () => void;
  /** Viewport height of the scroll area in px. Default 400. */
  height?: number;
  /** Rows kept mounted beyond the visible range, each side. Default 6. */
  overscanCount?: number;
  /** Rows from the end at which to start loading the next page. Default 8. */
  thresholdRows?: number;
  /** Custom trailing row shown while/after the last page loads. */
  loadingRow?: React.ReactNode;
  /** Shown when there are no items and nothing more to load. */
  emptyState?: React.ReactNode;
  /** Accessible name for the list. */
  ariaLabel?: string;
  className?: string;
}

interface InfiniteRowProps<T> {
  items: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  isLoaderRow: (index: number) => boolean;
  loadingRow: React.ReactNode;
}

function DefaultLoadingRow(): React.JSX.Element {
  return <span className={styles.spinner} />;
}

// Defined outside the component so its identity is stable across renders
// (react-window re-mounts rows if the row component type changes).
function InfiniteRow<T>({
  index,
  style,
  items,
  renderRow,
  isLoaderRow,
  loadingRow,
}: RowComponentProps<InfiniteRowProps<T>>): React.JSX.Element {
  if (isLoaderRow(index)) {
    // The visible loading state; announced separately via the live region, so
    // this row is hidden from the list semantics to avoid an empty list item.
    return (
      <div style={style} className={styles.loaderRow} aria-hidden="true">
        {loadingRow ?? <DefaultLoadingRow />}
      </div>
    );
  }
  // No list/listitem role: react-window inserts a sizing div between the
  // container and the rows, which cannot satisfy listitem's required `list`
  // parent. The named role="group" container conveys grouping; row content is
  // read in order. Consumers needing richer semantics can role their own
  // content inside renderRow.
  return (
    <div style={style} className={styles.row}>
      {renderRow(items[index], index)}
    </div>
  );
}

/**
 * A virtualized, lazy-loading list. react-window keeps only the visible rows
 * (plus `overscanCount`) in the DOM, mounting and unmounting them as you scroll,
 * and the next page is fetched via `onLoadMore` as the rendered range approaches
 * the end (`thresholdRows`). Generic over the data source - feed it
 * `usePaginatedQuery` (or anything) via hasNext/isLoadingNext/onLoadMore. For
 * small lists where windowing is overkill, use `useInfiniteScroll` instead.
 */
function InfiniteListInner<T>({
  items,
  rowHeight,
  renderRow,
  hasNext,
  isLoadingNext,
  onLoadMore,
  height = 400,
  overscanCount = 6,
  thresholdRows = 8,
  loadingRow,
  emptyState,
  ariaLabel,
  className,
}: InfiniteListProps<T>): React.JSX.Element {
  const {rowCount, onRowsRendered, isLoaderRow} = useVirtualInfinite({
    itemCount: items.length,
    hasNext,
    isLoadingNext,
    onLoadMore,
    thresholdRows,
  });

  const rowProps = useMemo<InfiniteRowProps<T>>(
    () => ({items, renderRow, isLoaderRow, loadingRow}),
    [items, renderRow, isLoaderRow, loadingRow],
  );

  const RowComponent = useCallback(
    (props: RowComponentProps<InfiniteRowProps<T>>) => <InfiniteRow<T> {...props} />,
    [],
  );

  const wrapperClass = [styles.wrapper, className].filter(Boolean).join(' ');

  if (items.length === 0 && !hasNext) {
    return (
      <div className={wrapperClass} style={{height}}>
        {emptyState}
      </div>
    );
  }

  return (
    // role="group" is a valid required-parent for the listitem rows and (unlike
    // role="list") imposes no required-children rule, so react-window's inner
    // sizing div and the status sibling don't trip aria-required-children. The
    // role lives on this wrapper - which we always render - rather than being
    // passed through to react-window's outer element.
    <div
      className={wrapperClass}
      role="group"
      aria-label={ariaLabel}
      aria-busy={isLoadingNext || undefined}
    >
      <List
        rowHeight={rowHeight}
        rowCount={rowCount}
        rowComponent={RowComponent}
        rowProps={rowProps}
        onRowsRendered={onRowsRendered}
        overscanCount={overscanCount}
        style={{height, overflowY: 'auto'}}
      />
      <span className={styles.srOnly} role="status" aria-live="polite">
        {isLoadingNext ? 'Loading more items' : ''}
      </span>
    </div>
  );
}

export const InfiniteList = InfiniteListInner as <T>(
  props: InfiniteListProps<T>,
) => React.JSX.Element;
