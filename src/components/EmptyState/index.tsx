import React, {useCallback} from 'react';
import {Button} from '../Button';
import styles from './EmptyState.module.css';

const DefaultIcon = (): JSX.Element => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="8" y="6" width="32" height="36" rx="3" stroke="currentColor" strokeWidth="2" />
    <line x1="15" y1="16" x2="33" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="15" y1="22" x2="33" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="15" y1="28" x2="25" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = React.memo(function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps): JSX.Element {
  const handleActionClick = useCallback(() => {
    action?.onClick();
  }, [action]);

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <span className={styles.icon}>{icon ?? <DefaultIcon />}</span>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && (
        <Button variant="primary" onClick={handleActionClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
});
