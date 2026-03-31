import React from 'react';
import styles from './LoadingSpinner.module.css';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  color,
  className,
}: LoadingSpinnerProps): JSX.Element {
  return (
    <svg
      className={[styles.spinner, styles[size], className].filter(Boolean).join(' ')}
      style={{color: color ?? 'var(--smd-color-primary-50)'}}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity={0.2}
        strokeWidth={2.5}
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}
