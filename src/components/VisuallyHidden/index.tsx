import React, {forwardRef} from 'react';
import styles from './VisuallyHidden.module.css';

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element/component to render. Default 'span'. For the skip-link pattern set
   * `as="a"` with an `href` so the rendered element is itself focusable (focus
   * lands on it, not a nested node), which is what `focusable` reveals.
   */
  as?: React.ElementType;
  /**
   * When true the content becomes visible once the rendered element receives
   * keyboard focus (skip-link pattern) instead of staying permanently hidden.
   * Requires the element to be focusable - use with `as="a"`/a button, not a
   * bare span. Default false.
   */
  focusable?: boolean;
  /** Convenience for the common `as="a"` skip-link case. */
  href?: string;
  children: React.ReactNode;
}

/**
 * Renders content that is available to assistive technology but not painted -
 * the accessible-name and skip-link primitive. Prefer this over inline
 * clip/position hacks so the hiding technique lives in one place. Polymorphic
 * via `as` so a focusable skip link is the focusable element itself.
 */
export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  function VisuallyHidden({as: Tag = 'span', focusable = false, className, children, ...rest}, ref) {
    const classes = [styles.visuallyHidden, focusable ? styles.focusable : '', className]
      .filter(Boolean)
      .join(' ');
    return React.createElement(Tag, {ref, className: classes, ...rest}, children);
  },
);
