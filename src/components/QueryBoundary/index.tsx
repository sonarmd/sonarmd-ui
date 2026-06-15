import React, {forwardRef} from 'react';
import {EmptyState} from '../EmptyState';
import {Button} from '../Button';
import type {QueryResult} from '../../data';
import styles from './QueryBoundary.module.css';

export interface QueryBoundaryProps<T> {
  /** The result object from useQuery. */
  query: Pick<QueryResult<T>, 'status' | 'data' | 'error' | 'refetch'>;
  /**
   * Rendered when status is 'success' and data is non-null/non-empty.
   * Receives typed data so consumers write no conditionals.
   */
  children: (data: T) => React.ReactNode;
  /**
   * Custom skeleton. Defaults to a pulsing block (the settle animation pattern
   * from V1_SPEC S6.6).
   */
  skeleton?: React.ReactNode;
  /**
   * Custom empty state. Defaults to a standard EmptyState with no action.
   */
  emptyState?: React.ReactNode;
  /**
   * Determines whether data is considered "empty".
   * Default: Array.isArray(d) && d.length === 0 || d == null.
   */
  isEmpty?: (data: T) => boolean;
  className?: string;
  style?: React.CSSProperties;
}

function defaultIsEmpty<T>(data: T): boolean {
  if (data == null) return true;
  if (Array.isArray(data)) return data.length === 0;
  return false;
}

const DefaultSkeleton = (): JSX.Element => (
  <div className={styles.skeleton} role="status" aria-label="Loading..." />
);

const SmallAlertIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3L22 20H2L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <line x1="12" y1="10" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="17.5" r="0.75" fill="currentColor" />
  </svg>
);

function QueryErrorCard({onRetry}: {onRetry: () => void}): JSX.Element {
  return (
    <div className={styles.errorCard} role="alert">
      <div className={styles.errorInner}>
        <div className={styles.errorIcon}><SmallAlertIcon /></div>
        <p className={styles.errorTitle}>Could not load</p>
        <p className={styles.errorMessage}>An error occurred.</p>
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}

function QueryBoundaryInner<T>(
  {query, children, skeleton, emptyState, isEmpty, className, style}: QueryBoundaryProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const {status, data, refetch} = query;
  const isEmptyFn = isEmpty ?? defaultIsEmpty;

  if (status === 'idle' || status === 'loading') {
    return (
      <div ref={ref} className={className} style={style}>
        {skeleton ?? <DefaultSkeleton />}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div ref={ref} className={className} style={style}>
        <QueryErrorCard onRetry={refetch} />
      </div>
    );
  }

  if (data == null || isEmptyFn(data)) {
    return (
      <div ref={ref} className={className} style={style}>
        {emptyState ?? <EmptyState title="No data" />}
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={style}>
      {children(data)}
    </div>
  );
}

/**
 * Renders the appropriate state for a useQuery result without consumer
 * conditionals. Loading -> skeleton, error -> compact error card with retry
 * wired to refetch, empty -> EmptyState, success -> children(data).
 *
 * Criterion 6.6: all three non-success states are handled from props.
 */
// forwardRef does not natively support generics in TypeScript; use the
// cast pattern to preserve T.
export const QueryBoundary = forwardRef(QueryBoundaryInner) as <T>(
  props: QueryBoundaryProps<T> & {ref?: React.ForwardedRef<HTMLDivElement>},
) => JSX.Element;
