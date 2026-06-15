import React, {useCallback, useMemo} from 'react';
import {Button} from '../Button';
import styles from './FilterBar.module.css';

export interface FilterBarProps {
  children: React.ReactNode;
  onClear?: () => void;
  activeFilterCount?: number;
  className?: string;
}

export const FilterBar = React.memo(function FilterBar({
  children,
  onClear,
  activeFilterCount,
  className,
}: FilterBarProps): JSX.Element {
  const barClassName = useMemo(
    () => `${styles.bar}${className ? ` ${className}` : ''}`,
    [className],
  );

  const handleClear = useCallback(() => {
    onClear?.();
  }, [onClear]);

  return (
    <div className={barClassName}>
      <div className={styles.filters}>{children}</div>
      {onClear && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          {activeFilterCount != null && activeFilterCount > 0 && (
            <span className={styles.badge}>{activeFilterCount}</span>
          )}
          Clear filters
        </Button>
      )}
    </div>
  );
});
