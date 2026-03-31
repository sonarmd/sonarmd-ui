import React, { type ReactNode } from 'react';
import styles from './FieldWrapper.module.css';

export interface FieldWrapperProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export const FieldWrapper = React.memo(function FieldWrapper({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: FieldWrapperProps): JSX.Element {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  const hintId = htmlFor ? `${htmlFor}-hint` : undefined;

  return (
    <div className={`${styles.wrapper}${className ? ` ${className}` : ''}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className={styles.label}
          {...(required ? { 'data-required': '' } : {})}
        >
          {label}
        </label>
      )}
      {children}
      {!error && hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});
