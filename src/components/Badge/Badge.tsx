import React, { useMemo } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'cyan' | 'magenta';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge = React.memo(function Badge({
  children,
  variant = 'neutral',
  dot = false,
  size = 'md',
  className,
}: BadgeProps): React.JSX.Element {
  const classes = useMemo(
    () => [styles.badge, styles[variant], styles[size], className].filter(Boolean).join(' '),
    [variant, size, className],
  );

  return (
    <span className={classes}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
});
