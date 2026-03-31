import { useId } from 'react';
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

export function CheckboxGroup({
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

  const groupClasses = [
    styles.group,
    orientation === 'horizontal' ? styles.horizontal : styles.vertical,
  ].join(' ');

  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

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
          <Checkbox
            key={opt.value}
            label={opt.label}
            name={name}
            value={opt.value}
            checked={value.includes(opt.value)}
            disabled={disabled || opt.disabled}
            onChange={(e) => handleChange(opt.value, e.target.checked)}
          />
        ))}
      </div>
    </FieldWrapper>
  );
}
