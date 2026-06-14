import React, {useMemo} from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonDensity = 'comfortable' | 'compact';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Control height from the shared size scale. Defaults to `md`. */
  size?: ButtonSize;
  /** `compact` trims padding one step for dense layouts. Defaults to `comfortable`. */
  density?: ButtonDensity;
  /** Shows a spinner in place of the label without a width shift; implies disabled. */
  loading?: boolean;
  /** Icon rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Icon rendered after the label. */
  iconRight?: React.ReactNode;
}

/**
 * The primary action primitive. All colors, heights, paddings, radii, and the
 * focus ring come from semantic tokens. `loading` swaps the label for an inline
 * spinner without changing width and forces the disabled state.
 */
export const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
      variant = 'primary',
      size = 'md',
      density = 'comfortable',
      loading = false,
      disabled,
      iconLeft,
      iconRight,
      type = 'button',
      className,
      children,
      ...rest
    },
    ref,
  ): JSX.Element {
    const classes = useMemo(
      () =>
        [
          styles.button,
          styles[variant],
          styles[size],
          density === 'compact' ? styles.compact : '',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [variant, size, density, className],
    );

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        <span className={[styles.label, loading ? styles.loadingLabel : ''].filter(Boolean).join(' ')}>
          {iconLeft}
          {children}
          {iconRight}
        </span>
      </button>
    );
  }),
);

Button.displayName = 'Button';
