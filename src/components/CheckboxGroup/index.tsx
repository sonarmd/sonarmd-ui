import React, { useId, useRef, useCallback, useMemo } from 'react';
import { FieldWrapper } from '../FieldWrapper';
import { Checkbox } from '../Checkbox';
import styles from './CheckboxGroup.module.css';

export interface CheckboxGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: CheckboxGroupOption[];
  value: string[];
  onChange: (values: string[]) => void;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  name?: string;
}

export const CheckboxGroup = React.memo(function CheckboxGroup({
  label,
  error,
  hint,
  required,
  options,
  value,
  onChange,
  orientation = 'vertical',
  disabled,
  name,
}: CheckboxGroupProps): JSX.Element {
  const groupId = useId();
  const labelId = `${groupId}-label`;
  const fieldId = name ?? groupId;

  // Keep a ref to the current value array so handleGroupChange never stales
  const valueRef = useRef(value);
  valueRef.current = value;

  const groupClasses = useMemo(
    () =>
      [
        styles.group,
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
      ].join(' '),
    [orientation],
  );

  // Single stable handler — reads opt value from data attribute, current array from ref
  const handleGroupChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const optValue =
        (e.currentTarget.closest?.('[data-option-value]') as HTMLElement | null)
          ?.dataset.optionValue ?? (e.currentTarget as HTMLInputElement & { dataset: DOMStringMap }).dataset?.optionValue;
      if (!optValue) return;
      const checked = e.currentTarget.checked;
      const current = valueRef.current;
      onChange(checked ? [...current, optValue] : current.filter((v) => v !== optValue));
    },
    [onChange],
  );

  return (
    <FieldWrapper
      label={label}
      htmlFor={fieldId}
      required={required}
      error={error}
      hint={hint}
    >
      <div
        role="group"
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={
          error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
        }
        className={groupClasses}
      >
        {options.map((opt) => (
          <div key={opt.value} data-option-value={opt.value}>
            <Checkbox
              label={opt.label}
              name={name}
              value={opt.value}
              checked={value.includes(opt.value)}
              disabled={disabled || opt.disabled}
              onChange={handleGroupChange}
            />
          </div>
        ))}
      </div>
    </FieldWrapper>
  );
});
