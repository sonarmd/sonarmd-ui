import {forwardRef, HTMLAttributes} from 'react';
import styles from './Columns.module.css';

type SpaceKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16';

export interface ColumnsProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of equal columns. Overridden by `columns` template if provided. */
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  /** Explicit grid-template-columns value, e.g. "2fr 1fr". */
  template?: string;
  /** Gap from the spacing scale. */
  gap?: SpaceKey;
  /** Minimum column width before collapsing to single column. */
  minWidth?: string;
}

export const Columns = forwardRef<HTMLDivElement, ColumnsProps>(function Columns(
  {cols = 2, template, gap = '4', minWidth, style, children, ...rest},
  ref,
) {
  const gridTemplate = template
    ? template
    : minWidth
      ? `repeat(auto-fit, minmax(${minWidth}, 1fr))`
      : `repeat(${cols}, minmax(0, 1fr))`;
  return (
    <div
      ref={ref}
      className={styles.root}
      style={{
        gridTemplateColumns: gridTemplate,
        gap: `var(--smd-space-${gap})`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});
