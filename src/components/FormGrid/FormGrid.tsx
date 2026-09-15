import React, {useMemo, Children} from 'react';
import styles from './FormGrid.module.css';

export interface FormGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column count on wide viewports. Collapses to 1 column on narrow screens. */
  columns?: 1 | 2 | 3;
  /** Gap between cells, from the spacing scale. */
  gap?: 'sm' | 'md' | 'lg';
  /** Stagger each cell's entrance for an orchestrated load. */
  stagger?: boolean;
  /** Milliseconds between successive cell entrances when stagger is on. */
  staggerStep?: number;
}

/**
 * Responsive form layout. Each child occupies one cell; cells reflow to a
 * single column under 640px. With `stagger`, cells fade in in sequence
 * (disabled under prefers-reduced-motion).
 */
export const FormGrid = React.memo(
  React.forwardRef<HTMLDivElement, FormGridProps>(function FormGrid(
    {columns = 1, gap = 'md', stagger = false, staggerStep = 60, className, children, ...rest},
    ref,
  ) {
    const classes = useMemo(
      () =>
        [styles.grid, styles[`cols${columns}`], styles[`gap${gap}`], className]
          .filter(Boolean)
          .join(' '),
      [columns, gap, className],
    );

    const cellClasses = useMemo(
      () => (stagger ? `${styles.cell} ${styles.reveal}` : styles.cell),
      [stagger],
    );

    const cells = useMemo(
      () =>
        Children.toArray(children).map((child, index) => (
          <div
            key={index}
            className={cellClasses}
            style={stagger ? {animationDelay: `${index * staggerStep}ms`} : undefined}
          >
            {child}
          </div>
        )),
      [children, cellClasses, stagger, staggerStep],
    );

    return (
      <div ref={ref} className={classes} {...rest}>
        {cells}
      </div>
    );
  }),
);

FormGrid.displayName = 'FormGrid';
