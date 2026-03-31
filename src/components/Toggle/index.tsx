import React, { useId } from 'react';
import styles from './Toggle.module.css';

export interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  name?: string;
  labelPosition?: 'left' | 'right';
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { label, checked, onChange, size = 'md', disabled, name, labelPosition = 'right' },
  ref,
) {
  const inputId = useId();

  const rootClasses = [
    styles.root,
    size !== 'md' ? styles[size] : '',
    disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  const labelEl = <span className={styles.label}>{label}</span>;

  const track = (
    <>
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        role="switch"
        aria-checked={checked}
        className={styles.input}
        checked={checked}
        disabled={disabled}
        name={name}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
    </>
  );

  return (
    <label htmlFor={inputId} className={rootClasses}>
      {labelPosition === 'left' && labelEl}
      {track}
      {labelPosition === 'right' && labelEl}
    </label>
  );
});
