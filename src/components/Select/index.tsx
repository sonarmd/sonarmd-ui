import React from 'react';
import { FieldWrapper } from '../FieldWrapper';
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

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
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
) {
  const selectId = id ?? (name ? `select-${name}` : undefined);

  const selectClasses = [styles.select, size !== 'md' ? styles[size] : ''].filter(Boolean).join(' ');

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
        aria-describedby={
          error && selectId
            ? `${selectId}-error`
            : hint && selectId
              ? `${selectId}-hint`
              : undefined
        }
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
});
