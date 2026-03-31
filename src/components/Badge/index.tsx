import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'cyan' | 'magenta';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  dot = false,
  size = 'md',
  className,
}: BadgeProps): JSX.Element {
  const classes = [styles.badge, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
