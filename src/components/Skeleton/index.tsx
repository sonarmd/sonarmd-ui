import React, {useMemo} from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect';
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

export const Skeleton = React.memo(function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  className,
}: SkeletonProps): JSX.Element {
  const sizeStyle = useMemo<React.CSSProperties>(
    () => ({
      ...(width !== undefined ? {width} : {}),
      ...(height !== undefined ? {height} : {}),
    }),
    [width, height],
  );

  const singleClassName = useMemo(
    () =>
      [
        styles.skeleton,
        variant === 'text' ? styles.text : undefined,
        variant === 'circle' ? styles.circle : undefined,
        variant === 'rect' ? styles.rect : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' '),
    [variant, className],
  );

  const groupClassName = useMemo(
    () => [styles.textGroup, className].filter(Boolean).join(' '),
    [className],
  );

  if (variant === 'text' && lines > 1) {
    return (
      <div className={groupClassName}>
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

  return <div className={singleClassName} style={sizeStyle} />;
});
