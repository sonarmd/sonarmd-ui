import React, {useMemo, useState, useCallback} from 'react';
import {FieldWrapper} from '../FieldWrapper';
import {sonarFC} from '../../internal/sonarFC';
import styles from './SecureField.module.css';

const EYE = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M1 8s2.6-5 7-5 7 5 7 5-2.6 5-7 5-7-5-7-5Z" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="8" cy="8" r="2.1" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const EYE_OFF = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6.2 3.3A6.7 6.7 0 0 1 8 3c4.4 0 7 5 7 5a12 12 0 0 1-2 2.5M3.2 4.6A12 12 0 0 0 1 8s2.6 5 7 5a6.6 6.6 0 0 0 2.6-.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export interface SecureFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  /** Show a toggle to reveal the value in plaintext. Defaults to true. */
  revealable?: boolean;
}

/**
 * A masked input for sensitive data (SSN, MRN, etc.). Obscured by default with
 * an optional reveal toggle; autofill/autocorrect/spellcheck are disabled so
 * PHI is never captured by browsers or password managers.
 */
export const SecureField = React.memo(
  sonarFC<HTMLInputElement, SecureFieldProps>('SecureField', (
    {
      label,
      error,
      hint,
      size = 'md',
      required,
      revealable = true,
      id,
      name,
      className,
      autoComplete,
      ...inputProps
    },
    ref,
  ) => {
    const [revealed, setRevealed] = useState(false);

    const inputId = useMemo(
      () => id ?? (name ? `secure-${name}` : undefined),
      [id, name],
    );

    const ariaDescribedBy = useMemo(
      () =>
        error && inputId
          ? `${inputId}-error`
          : hint && inputId
            ? `${inputId}-hint`
            : undefined,
      [error, hint, inputId],
    );

    const wrapperClasses = useMemo(
      () =>
        [
          styles.wrapper,
          size !== 'md' ? styles[size] : '',
          revealable ? styles.hasToggle : '',
        ]
          .filter(Boolean)
          .join(' '),
      [size, revealable],
    );

    const toggle = useCallback(() => setRevealed((prev) => !prev), []);

    return (
      <FieldWrapper
        label={label}
        htmlFor={inputId}
        required={required}
        error={error}
        hint={hint}
        className={className}
      >
        <div className={wrapperClasses}>
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={revealed ? 'text' : 'password'}
            className={styles.input}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={ariaDescribedBy}
            required={required}
            autoComplete={autoComplete ?? 'off'}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            data-sensitive=""
            {...inputProps}
          />
          {revealable && (
            <button
              type="button"
              className={styles.toggle}
              onClick={toggle}
              aria-label={revealed ? 'Hide value' : 'Show value'}
              aria-pressed={revealed}
            >
              {revealed ? EYE_OFF : EYE}
            </button>
          )}
        </div>
      </FieldWrapper>
    );
  }),
);
