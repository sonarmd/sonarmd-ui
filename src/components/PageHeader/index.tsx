import React, {useMemo} from 'react';
import {Link} from 'react-router-dom';
import styles from './PageHeader.module.css';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export const PageHeader = React.memo(function PageHeader({
  title,
  subtitle,
  backTo,
  backLabel = 'Back',
  actions,
  breadcrumbs,
}: PageHeaderProps): JSX.Element {
  const renderedBreadcrumbs = useMemo(() => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;
    return breadcrumbs.map((crumb, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span className={styles.breadcrumbSep}>/</span>}
        {crumb.to ? (
          <Link to={crumb.to} className={styles.breadcrumbLink}>
            {crumb.label}
          </Link>
        ) : (
          <span>{crumb.label}</span>
        )}
      </React.Fragment>
    ));
  }, [breadcrumbs]);

  return (
    <header className={styles.header}>
      {renderedBreadcrumbs && (
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          {renderedBreadcrumbs}
        </nav>
      )}
      {backTo && (
        <Link to={backTo} className={styles.back}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {backLabel}
        </Link>
      )}
      <div className={styles.row}>
        <div className={styles.titles}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </header>
  );
});
