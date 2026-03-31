import React, { useId, useRef, useCallback, useMemo } from 'react';
import { FieldWrapper } from '../FieldWrapper';
import { Radio } from '../Radio';
import styles from './RadioGroup.module.css';

export interface RadioGroupOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: RadioGroupOption[];
  value: string;
  onChange: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  name: string;
}

export const RadioGroup = React.memo(function RadioGroup({
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
}: RadioGroupProps): JSX.Element {
  const groupId = useId();
  const labelId = `${groupId}-label`;
  const fieldId = name ?? groupId;

  const radioRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Keep current value in a ref so handleKeyDown never stales on value changes
  const valueRef = useRef(value);
  valueRef.current = value;

  const enabledIndices = useMemo(
    () =>
      options
        .map((opt, i) => ({ opt, i }))
        .filter(({ opt }) => !opt.disabled && !disabled)
        .map(({ i }) => i),
    [options, disabled],
  );

  // Stable ref so handleKeyDown can read current enabledIndices without re-creating
  const enabledIndicesRef = useRef(enabledIndices);
  enabledIndicesRef.current = enabledIndices;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      e.preventDefault();

      const currentValue = valueRef.current;
      const currentEnabledIndices = enabledIndicesRef.current;
      const currentIndex = options.findIndex((opt) => opt.value === currentValue);
      const enabledCount = currentEnabledIndices.length;
      if (enabledCount === 0) return;

      const currentEnabledPos = currentEnabledIndices.indexOf(currentIndex);
      let nextEnabledPos: number;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextEnabledPos = currentEnabledPos === -1 ? 0 : (currentEnabledPos + 1) % enabledCount;
      } else {
        nextEnabledPos =
          currentEnabledPos === -1
            ? enabledCount - 1
            : (currentEnabledPos - 1 + enabledCount) % enabledCount;
      }

      const nextIndex = currentEnabledIndices[nextEnabledPos];
      onChange(options[nextIndex].value);
      radioRefs.current[nextIndex]?.focus();
    },
    [options, onChange],
  );

  const handleChange = useCallback(
    (optValue: string) => {
      onChange(optValue);
    },
    [onChange],
  );

  const groupClasses = useMemo(
    () =>
      [
        styles.group,
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
      ].join(' '),
    [orientation],
  );

  const hasDescriptions = useMemo(
    () => options.some((opt) => opt.description),
    [options],
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
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={
          error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
        }
        aria-required={required}
        className={groupClasses}
        onKeyDown={handleKeyDown}
      >
        {options.map((opt, i) => {
          const isSelected = opt.value === value;
          const isDisabled = disabled || opt.disabled;

          if (hasDescriptions) {
            const cardClasses = [
              styles.card,
              isSelected ? styles.cardSelected : '',
              isDisabled ? styles.cardDisabled : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div key={opt.value} className={cardClasses}>
                <Radio
                  ref={(el) => {
                    radioRefs.current[i] = el;
                  }}
                  label={opt.label}
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => handleChange(opt.value)}
                  tabIndex={isSelected || (!value && i === 0) ? 0 : -1}
                />
                {opt.description && (
                  <p className={styles.cardDescription}>{opt.description}</p>
                )}
              </div>
            );
          }

          return (
            <Radio
              key={opt.value}
              ref={(el) => {
                radioRefs.current[i] = el;
              }}
              label={opt.label}
              name={name}
              value={opt.value}
              checked={isSelected}
              disabled={isDisabled}
              onChange={() => handleChange(opt.value)}
              tabIndex={isSelected || (!value && i === 0) ? 0 : -1}
            />
          );
        })}
      </div>
    </FieldWrapper>
  );
});
