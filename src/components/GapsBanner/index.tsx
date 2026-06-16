import React, {useCallback, useMemo} from 'react';
import styles from './GapsBanner.module.css';

export interface GapsBannerProps {
  title: string;
  description?: string;
  variant?: 'info' | 'warning' | 'success';
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

function DismissIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const GapsBanner = React.memo(function GapsBanner({
  title,
  description,
  variant = 'info',
  action,
  dismissible,
  onDismiss,
  className,
}: GapsBannerProps): React.JSX.Element {
  const bannerClassName = useMemo(
    () => [styles.banner, styles[variant], className].filter(Boolean).join(' '),
    [variant, className],
  );

  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  const handleActionClick = useCallback(() => {
    action?.onClick();
  }, [action]);

  return (
    <div
      className={bannerClassName}
      role="status"
      aria-live="polite"
    >
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {(action || dismissible) && (
        <div className={styles.right}>
          {action && (
            <button type="button" className={styles.actionBtn} onClick={handleActionClick}>
              {action.label}
            </button>
          )}
          {dismissible && (
            <button
              type="button"
              className={styles.dismissBtn}
              onClick={handleDismiss}
              aria-label="Dismiss"
            >
              <DismissIcon />
            </button>
          )}
        </div>
      )}
    </div>
  );
});
