import React from 'react';
import styles from './ChartCard.module.css';

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  placeholderHeight?: number;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  action,
  isLoading,
  isEmpty,
  emptyMessage = 'No data available',
  placeholderHeight = 192,
  children,
  className,
}: ChartCardProps): JSX.Element {
  const renderBody = () => {
    if (isLoading) {
      return (
        <div
          className={styles.skeleton}
          style={{height: placeholderHeight}}
          aria-hidden="true"
        />
      );
    }
    if (isEmpty) {
      return (
        <p className={styles.empty} style={{height: placeholderHeight}}>
          {emptyMessage}
        </p>
      );
    }
    return <div className={styles.body}>{children}</div>;
  };

  return (
    <div className={`${styles.card}${className ? ` ${className}` : ''}`}>
      <div className={styles.header}>
        <div className={styles.titles}>
          <p className={styles.title}>{title}</p>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {action && <div className={styles.action}>{action}</div>}
      </div>
      {renderBody()}
    </div>
  );
}
