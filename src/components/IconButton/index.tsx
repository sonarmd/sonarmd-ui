import React from 'react';
import {Button, type ButtonProps} from '../Button';
import {Tooltip} from '../Tooltip';

export interface IconButtonProps extends Omit<ButtonProps, 'iconLeft' | 'iconRight' | 'loading' | 'square'> {
  /**
   * Accessible name. Becomes the button's aria-label and the tooltip text.
   * Required - the component will not compile without it (no default).
   */
  label: string;
  /** The icon to render. */
  children: React.ReactNode;
  /** Tooltip placement. Defaults to `top`. */
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * A square, icon-only button. Reuses Button for all variant/size/focus styling
 * via its `square` shape, sets `aria-label` from the required `label`, and shows
 * that label as a Tooltip on hover and focus-visible.
 */
export const IconButton = React.memo(
  React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
    {label, children, tooltipPlacement = 'top', variant = 'ghost', ...rest},
    ref,
  ): JSX.Element {
    return (
      <Tooltip content={label} placement={tooltipPlacement}>
        <Button ref={ref} square variant={variant} aria-label={label} {...rest}>
          {children}
        </Button>
      </Tooltip>
    );
  }),
);

IconButton.displayName = 'IconButton';
