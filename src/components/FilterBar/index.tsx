import React from 'react';
import styles from './FilterBar.module.css';

export interface FilterBarProps {
  children: React.ReactNode;
  onClear?: () => void;
  activeFilterCount?: number;
  className?: string;
}

export function FilterBar({
  children,
  onClear,
  activeFilterCount,
  className,
}: FilterBarProps): JSX.Element {
  return (
    <div className={`${styles.bar}${className ? ` ${className}` : ''}`}>
      <div className={styles.filters}>{children}</div>
      {onClear && (
        <button type="button" className={styles.clearBtn} onClick={onClear}>
          {activeFilterCount != null && activeFilterCount > 0 && (
            <span className={styles.badge}>{activeFilterCount}</span>
          )}
          Clear filters
        </button>
      )}
    </div>
  );
}
