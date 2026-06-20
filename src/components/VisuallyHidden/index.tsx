import React, {forwardRef} from 'react';
import styles from './VisuallyHidden.module.css';

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * When true the content becomes visible on keyboard focus (skip-link
   * pattern) instead of staying permanently hidden. Default false.
   */
  focusable?: boolean;
  children: React.ReactNode;
}

/**
 * Renders content that is available to assistive technology but not painted -
 * the accessible-name and skip-link primitive. Prefer this over inline
 * clip/position hacks so the hiding technique lives in one place.
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({focusable = false, className, children, ...rest}, ref) {
    const classes = [styles.visuallyHidden, focusable ? styles.focusable : '', className]
      .filter(Boolean)
      .join(' ');
    return (
      <span ref={ref} className={classes} {...rest}>
        {children}
      </span>
    );
  },
);
