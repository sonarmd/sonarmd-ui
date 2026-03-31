import React, {useMemo} from 'react';
import styles from './LoadingSpinner.module.css';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const LoadingSpinner = React.memo(function LoadingSpinner({
  size = 'md',
  color,
  className,
}: LoadingSpinnerProps): JSX.Element {
  const spinnerStyle = useMemo<React.CSSProperties>(
    () => ({color: color ?? 'var(--smd-color-primary-50)'}),
    [color],
  );

  return (
    <svg
      className={[styles.spinner, styles[size], className].filter(Boolean).join(' ')}
      style={spinnerStyle}
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
});
