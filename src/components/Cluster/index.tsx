import {forwardRef, HTMLAttributes} from 'react';
import styles from './Cluster.module.css';

type SpaceKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16';

export interface ClusterProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap between children, from the spacing scale. */
  gap?: SpaceKey;
  /** Cross-axis alignment. Defaults to center. */
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  /** Main-axis distribution. */
  justify?: 'start' | 'center' | 'end' | 'space-between';
  /** Wrap when children overflow. Defaults to true. */
  wrap?: boolean;
}

export const Cluster = forwardRef<HTMLDivElement, ClusterProps>(function Cluster(
  {gap = '3', align = 'center', justify = 'start', wrap = true, className, style, children, ...rest},
  ref,
) {
  return (
    <div
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{
        '--cluster-gap': `var(--smd-space-${gap})`,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      } as React.CSSProperties}
      {...rest}
    >
      {children}
    </div>
  );
});
