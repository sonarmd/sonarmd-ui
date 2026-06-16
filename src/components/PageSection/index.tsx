import React, {useMemo} from 'react';
import styles from './PageSection.module.css';

export interface PageSectionProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PageSection = React.memo(function PageSection({
  title,
  subtitle,
  action,
  children,
  className,
}: PageSectionProps): React.JSX.Element {
  const sectionClassName = useMemo(
    () => `${styles.section}${className ? ` ${className}` : ''}`,
    [className],
  );

  const hasHeader = title || subtitle || action;

  return (
    <section className={sectionClassName}>
      {hasHeader && (
        <div className={styles.header}>
          {(title || subtitle) && (
            <div className={styles.titles}>
              {title && <h2 className={styles.title}>{title}</h2>}
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
          )}
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
});
