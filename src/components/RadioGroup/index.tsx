import { useId, useRef, useCallback } from 'react';
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

export function RadioGroup({
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

  const enabledIndices = options
    .map((opt, i) => ({ opt, i }))
    .filter(({ opt }) => !opt.disabled && !disabled)
    .map(({ i }) => i);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      e.preventDefault();

      const currentIndex = options.findIndex((opt) => opt.value === value);
      const enabledCount = enabledIndices.length;
      if (enabledCount === 0) return;

      const currentEnabledPos = enabledIndices.indexOf(currentIndex);
      let nextEnabledPos: number;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextEnabledPos = currentEnabledPos === -1 ? 0 : (currentEnabledPos + 1) % enabledCount;
      } else {
        nextEnabledPos =
          currentEnabledPos === -1
            ? enabledCount - 1
            : (currentEnabledPos - 1 + enabledCount) % enabledCount;
      }

      const nextIndex = enabledIndices[nextEnabledPos];
      onChange(options[nextIndex].value);
      radioRefs.current[nextIndex]?.focus();
    },
    [options, value, onChange, enabledIndices],
  );

  const groupClasses = [
    styles.group,
    orientation === 'horizontal' ? styles.horizontal : styles.vertical,
  ].join(' ');

  const hasDescriptions = options.some((opt) => opt.description);

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
                  onChange={() => onChange(opt.value)}
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
              onChange={() => onChange(opt.value)}
              tabIndex={isSelected || (!value && i === 0) ? 0 : -1}
            />
          );
        })}
      </div>
    </FieldWrapper>
  );
}
