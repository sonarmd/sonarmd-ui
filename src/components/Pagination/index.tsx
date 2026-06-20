import React, {useCallback, useMemo} from 'react';
import styles from './Pagination.module.css';

export interface PaginationProps {
  /** Current page, 1-based. */
  page: number;
  /** Total number of pages (>= 1). */
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current page. Default 1. */
  siblingCount?: number;
  /** Pages pinned at the start and end. Default 1. */
  boundaryCount?: number;
  size?: 'sm' | 'md';
  /** Accessible name for the navigation landmark. Default "Pagination". */
  ariaLabel?: string;
  className?: string;
}

type PageItem = number | 'start-ellipsis' | 'end-ellipsis';

function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

/** Build the visible page list with collapsed ranges, deterministic and gap-safe. */
function buildItems(page: number, pageCount: number, sibling: number, boundary: number): PageItem[] {
  const totalShown = boundary * 2 + sibling * 2 + 3; // boundaries + window + current + 2 ellipses
  if (pageCount <= totalShown) return range(1, pageCount);

  const startPages = range(1, boundary);
  const endPages = range(pageCount - boundary + 1, pageCount);
  const left = Math.max(Math.min(page - sibling, pageCount - boundary - sibling * 2 - 1), boundary + 2);
  const right = Math.min(Math.max(page + sibling, boundary + sibling * 2 + 2), endPages[0] - 2);

  return [
    ...startPages,
    left > boundary + 2 ? 'start-ellipsis' : boundary + 1,
    ...range(left, right),
    right < pageCount - boundary - 1 ? 'end-ellipsis' : pageCount - boundary,
    ...endPages,
  ];
}

function ChevronLeft(): React.JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight(): React.JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Page navigation for paged data sets. Renders a `nav` landmark; the current
 * page carries aria-current="page"; previous/next are labelled and disabled at
 * the bounds. Pairs with usePaginatedQuery / DataTable.
 */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  size = 'md',
  ariaLabel = 'Pagination',
  className,
}: PaginationProps): React.JSX.Element {
  const items = useMemo(
    () => buildItems(page, Math.max(1, pageCount), siblingCount, boundaryCount),
    [page, pageCount, siblingCount, boundaryCount],
  );

  const go = useCallback(
    (target: number) => {
      const clamped = Math.max(1, Math.min(pageCount, target));
      if (clamped !== page) onPageChange(clamped);
    },
    [page, pageCount, onPageChange],
  );

  const btn = (extra: string) => [styles.item, styles[size], extra].filter(Boolean).join(' ');

  return (
    <nav className={[styles.pagination, className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      <ul className={styles.list}>
        <li>
          <button
            type="button"
            className={btn(styles.nav)}
            onClick={() => go(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </button>
        </li>
        {items.map((item, i) =>
          typeof item === 'number' ? (
            <li key={item}>
              <button
                type="button"
                className={btn(item === page ? styles.current : '')}
                onClick={() => go(item)}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Page ${item}`}
              >
                {item}
              </button>
            </li>
          ) : (
            <li key={`${item}-${i}`} className={styles.ellipsis} aria-hidden="true">
              ...
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            className={btn(styles.nav)}
            onClick={() => go(page + 1)}
            disabled={page >= pageCount}
            aria-label="Next page"
          >
            <ChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  );
}
