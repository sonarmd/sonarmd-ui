import React from 'react';
import styles from './PageSection.module.css';

export interface PageSectionProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageSection({
  title,
  subtitle,
  action,
  children,
  className,
}: PageSectionProps): JSX.Element {
  const hasHeader = title || subtitle || action;

  return (
    <section className={`${styles.section}${className ? ` ${className}` : ''}`}>
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
}
