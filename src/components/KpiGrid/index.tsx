import React, {useMemo} from 'react';
import styles from './KpiGrid.module.css';
import {KpiCard} from '../KpiCard';
import type {KpiCardProps} from '../KpiCard';

export interface KpiGridProps {
  items: KpiCardProps[];
  columns?: 2 | 3 | 4;
  isLoading?: boolean;
}

const COLS_CLASS: Record<2 | 3 | 4, string> = {
  2: styles.cols2,
  3: styles.cols3,
  4: styles.cols4,
};

export const KpiGrid = React.memo(function KpiGrid({
  items,
  columns = 4,
  isLoading,
}: KpiGridProps): JSX.Element {
  const gridClassName = useMemo(
    () => [styles.grid, COLS_CLASS[columns]].join(' '),
    [columns],
  );

  return (
    <div className={gridClassName}>
      {items.map((item, i) => (
        <KpiCard key={item.title + String(i)} {...item} isLoading={isLoading ?? item.isLoading} />
      ))}
    </div>
  );
});
