import React, {useMemo} from 'react';
import styles from './FormActions.module.css';
import {sonarFC} from '../../internal/sonarFC';

export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Horizontal placement of the actions. */
  align?: 'start' | 'end' | 'between';
  /** Pin to the bottom of a scrolling form with a divider and surface. */
  sticky?: boolean;
}

/**
 * The submit/cancel zone for a form. Defaults to end-aligned (primary action
 * last). `sticky` keeps it in view for long forms without trapping focus.
 */
export const FormActions = React.memo(
  sonarFC<HTMLDivElement, FormActionsProps>('FormActions', (
    {align = 'end', sticky = false, className, children, ...rest},
    ref,
  ) => {
    const classes = useMemo(
      () =>
        [styles.actions, styles[align], sticky ? styles.sticky : '', className]
          .filter(Boolean)
          .join(' '),
      [align, sticky, className],
    );

    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  }),
);
