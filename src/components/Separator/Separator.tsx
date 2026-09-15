import React, {forwardRef} from 'react';
import styles from './Separator.module.css';

export interface SeparatorProps {
  /** Layout axis. Vertical separators need a sized flex/inline context. */
  orientation?: 'horizontal' | 'vertical';
  /**
   * When false the separator is purely decorative and removed from the
   * accessibility tree (role="none"). Default true (role="separator").
   */
  decorative?: boolean;
  /** Optional centered label (horizontal only), e.g. "OR". */
  label?: React.ReactNode;
  className?: string;
}

/**
 * A themed divider. Horizontal by default; pass `label` to render a centered
 * caption between two rules. Decorative separators are hidden from assistive
 * technology; semantic ones expose `role="separator"` with orientation.
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  {orientation = 'horizontal', decorative = true, label, className},
  ref,
) {
  const a11y = decorative
    ? ({role: 'none'} as const)
    : ({role: 'separator', 'aria-orientation': orientation} as const);

  if (label != null && orientation === 'horizontal') {
    return (
      <div
        ref={ref}
        className={[styles.labeled, className].filter(Boolean).join(' ')}
        {...a11y}
      >
        <span className={styles.rule} />
        <span className={styles.label}>{label}</span>
        <span className={styles.rule} />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={[styles.separator, styles[orientation], className].filter(Boolean).join(' ')}
      {...a11y}
    />
  );
});
