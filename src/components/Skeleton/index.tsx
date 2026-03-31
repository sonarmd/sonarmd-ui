import React from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  className,
}: SkeletonProps): JSX.Element {
  const sizeStyle: React.CSSProperties = {
    ...(width !== undefined ? {width} : {}),
    ...(height !== undefined ? {height} : {}),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={[styles.textGroup, className].filter(Boolean).join(' ')}>
        {Array.from({length: lines}).map((_, i) => (
          <div
            key={i}
            className={[
              styles.skeleton,
              styles.text,
              i === lines - 1 ? styles.textLast : undefined,
            ]
              .filter(Boolean)
              .join(' ')}
            style={sizeStyle}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={[
        styles.skeleton,
        variant === 'text' ? styles.text : undefined,
        variant === 'circle' ? styles.circle : undefined,
        variant === 'rect' ? styles.rect : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={sizeStyle}
    />
  );
}
