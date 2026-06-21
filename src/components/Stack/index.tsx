import {HTMLAttributes} from 'react';
import styles from './Stack.module.css';
import {sonarFC} from '../../internal/sonarFC';

type SpaceKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap between children, from the spacing scale. */
  gap?: SpaceKey;
  /** Cross-axis alignment. Defaults to stretch. */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Main-axis distribution. */
  justify?: 'start' | 'center' | 'end' | 'space-between';
}

export const Stack = sonarFC<HTMLDivElement, StackProps>(
  'Stack',
  (
  {gap = '4', align = 'stretch', justify = 'start', className, style, children, ...rest},
  ref,
) => {
  return (
    <div
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{
        '--stack-gap': `var(--smd-space-${gap})`,
        alignItems: align,
        justifyContent: justify,
        ...style,
      } as React.CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
  },
);
