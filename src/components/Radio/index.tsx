import React from 'react';
import styles from './Radio.module.css';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, size = 'md', className, ...inputProps },
  ref,
) {
  const rootClasses = [styles.root, size !== 'md' ? styles[size] : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={rootClasses}>
      <input ref={ref} type="radio" className={styles.input} {...inputProps} />
      <span className={styles.circle} />
      <span className={styles.label}>{label}</span>
    </label>
  );
});
