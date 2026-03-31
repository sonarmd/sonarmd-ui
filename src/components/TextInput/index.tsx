import React from 'react';
import { FieldWrapper } from '../FieldWrapper';
import styles from './TextInput.module.css';

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  required?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      label,
      error,
      hint,
      size = 'md',
      iconLeft,
      iconRight,
      required,
      id,
      name,
      className,
      ...inputProps
    },
    ref,
  ) {
    const inputId = id ?? (name ? `input-${name}` : undefined);

    const wrapperClasses = [
      styles.wrapper,
      size !== 'md' ? styles[size] : '',
      iconLeft ? styles.hasIconLeft : '',
      iconRight ? styles.hasIconRight : '',
    ]
      .filter(Boolean)
      .join(' ');

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
          {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
          <input
            ref={ref}
            id={inputId}
            name={name}
            className={styles.input}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error && inputId
                ? `${inputId}-error`
                : hint && inputId
                  ? `${inputId}-hint`
                  : undefined
            }
            required={required}
            {...inputProps}
          />
          {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
        </div>
      </FieldWrapper>
    );
  },
);
