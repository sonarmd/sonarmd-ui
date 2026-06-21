import React, { useMemo } from 'react';
import { FieldWrapper } from '../FieldWrapper';
import {sonarFC} from '../../internal/sonarFC';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.memo(
  sonarFC<HTMLSelectElement, SelectProps>('Select', (
    {
      label,
      error,
      hint,
      size = 'md',
      required,
      options,
      placeholder,
      id,
      name,
      className,
      ...selectProps
    },
    ref,
  ) => {
    const selectId = useMemo(
      () => id ?? (name ? `select-${name}` : undefined),
      [id, name],
    );

    const ariaDescribedBy = useMemo(
      () =>
        error && selectId
          ? `${selectId}-error`
          : hint && selectId
            ? `${selectId}-hint`
            : undefined,
      [error, hint, selectId],
    );

    const selectClasses = useMemo(
      () => [styles.select, size !== 'md' ? styles[size] : ''].filter(Boolean).join(' '),
      [size],
    );

    return (
      <FieldWrapper
        label={label}
        htmlFor={selectId}
        required={required}
        error={error}
        hint={hint}
        className={className}
      >
        <select
          ref={ref}
          id={selectId}
          name={name}
          className={selectClasses}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
          required={required}
          {...selectProps}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    );
  }),
);
