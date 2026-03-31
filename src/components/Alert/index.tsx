import React from 'react';
import styles from './Alert.module.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

function IconInfo(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="var(--smd-color-primary-50)" strokeWidth="1.5" fill="none" />
      <path d="M8 7v5" stroke="var(--smd-color-primary-50)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="4.5" r="0.75" fill="var(--smd-color-primary-50)" />
    </svg>
  );
}

function IconSuccess(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="var(--smd-color-positive-30)" strokeWidth="1.5" fill="none" />
      <path d="M5 8l2.5 2.5L11 5.5" stroke="var(--smd-color-positive-30)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconWarning(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2L14.5 13.5H1.5L8 2Z" stroke="var(--smd-color-warning-30)" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M8 6v4" stroke="var(--smd-color-warning-30)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.75" fill="var(--smd-color-warning-30)" />
    </svg>
  );
}

function IconError(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="var(--smd-color-negative-30)" strokeWidth="1.5" fill="none" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="var(--smd-color-negative-30)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DismissIcon(): JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const defaultIcons: Record<AlertVariant, JSX.Element> = {
  info: <IconInfo />,
  success: <IconSuccess />,
  warning: <IconWarning />,
  error: <IconError />,
};

export function Alert({
  variant,
  title,
  children,
  dismissible,
  onDismiss,
  icon,
  className,
}: AlertProps): JSX.Element {
  const classes = [styles.alert, styles[variant], className].filter(Boolean).join(' ');
  const resolvedIcon = icon !== undefined ? icon : defaultIcons[variant];

  return (
    <div className={classes} role="alert">
      <span className={styles.icon}>{resolvedIcon}</span>
      <div className={styles.body}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.message}>{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          className={styles.dismissBtn}
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <DismissIcon />
        </button>
      )}
    </div>
  );
}
