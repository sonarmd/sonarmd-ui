import {forwardRef, HTMLAttributes} from 'react';
import styles from './Spacer.module.css';

type SpaceKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16';

export interface SpacerProps extends HTMLAttributes<HTMLDivElement> {
  /** Fixed size from the spacing scale. Omit to use flex-grow: 1 (fill mode). */
  size?: SpaceKey;
  /** Axis to space along. Defaults to vertical. */
  axis?: 'horizontal' | 'vertical';
}

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(function Spacer(
  {size, axis = 'vertical', className, style, ...rest},
  ref,
) {
  const isHorizontal = axis === 'horizontal';
  const sizeValue = size ? `var(--smd-space-${size})` : undefined;
  return (
    <div
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      style={{
        width:  isHorizontal ? sizeValue : undefined,
        height: !isHorizontal ? sizeValue : undefined,
        flexShrink: size ? 0 : undefined,
        flexGrow:   size ? undefined : 1,
        ...style,
      }}
      {...rest}
    />
  );
});
