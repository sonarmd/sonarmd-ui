import React from 'react';
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

export function KpiGrid({items, columns = 4, isLoading}: KpiGridProps): JSX.Element {
  return (
    <div className={[styles.grid, COLS_CLASS[columns]].join(' ')}>
      {items.map((item, i) => (
        <KpiCard key={item.title + String(i)} {...item} isLoading={isLoading ?? item.isLoading} />
      ))}
    </div>
  );
}
