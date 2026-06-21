import React, {useMemo} from 'react';
import styles from './Card.module.css';
import {sonarFC} from '../../internal/sonarFC';

export type CardVariant = 'default' | 'outlined' | 'elevated';
export type CardDensity = 'comfortable' | 'compact';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Border/elevation treatment. Defaults to `default`. */
  variant?: CardVariant;
  /** Padding scale. Defaults to `comfortable`. */
  density?: CardDensity;
  /** Optional header title. */
  title?: React.ReactNode;
  /** Optional header subtitle, below the title. */
  subtitle?: React.ReactNode;
  /** Optional header action, right-aligned. */
  action?: React.ReactNode;
}

/**
 * A generic surface. Renders an optional header (title/subtitle/action) above
 * its children. All surface, border, elevation, radius, and spacing values come
 * from semantic tokens.
 */
export const Card = React.memo(
  sonarFC<HTMLDivElement, CardProps>('Card', (
    {variant = 'default', density = 'comfortable', title, subtitle, action, className, children, ...rest},
    ref,
  ): React.JSX.Element => {
    const classes = useMemo(
      () =>
        [styles.card, styles[variant], styles[density], className].filter(Boolean).join(' '),
      [variant, density, className],
    );

    const hasHeader = title != null || subtitle != null || action != null;

    return (
      <div ref={ref} className={classes} {...rest}>
        {hasHeader && (
          <div className={styles.header}>
            <div className={styles.titles}>
              {title != null && <p className={styles.title}>{title}</p>}
              {subtitle != null && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            {action != null && <div className={styles.action}>{action}</div>}
          </div>
        )}
        {children}
      </div>
    );
  }),
);
