import React, {useMemo} from 'react';
import styles from './Fade.module.css';
import {sonarFC} from '../../internal/sonarFC';

export interface FadeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delay before the entrance animation starts, in milliseconds. */
  delay?: number;
}

/**
 * Mount-time entrance: a calm opacity + slight rise. CSS-only, GPU-friendly,
 * and fully disabled under prefers-reduced-motion.
 */
export const Fade = React.memo(
  sonarFC<HTMLDivElement, FadeProps>('Fade', (
    {delay, className, style, children, ...rest},
    ref,
  ) => {
    const classes = useMemo(
      () => [styles.fade, className].filter(Boolean).join(' '),
      [className],
    );

    const mergedStyle = useMemo(
      () => (delay != null ? {...style, animationDelay: `${delay}ms`} : style),
      [delay, style],
    );

    return (
      <div ref={ref} className={classes} style={mergedStyle} {...rest}>
        {children}
      </div>
    );
  }),
);
