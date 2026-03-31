import React, { useEffect, useRef } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, size = 'md', indeterminate, className, ...inputProps },
  forwardedRef,
) {
  const innerRef = useRef<HTMLInputElement>(null);
  const resolvedRef = (forwardedRef as React.RefObject<HTMLInputElement>) ?? innerRef;

  useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate, resolvedRef]);

  const rootClasses = [styles.root, size !== 'md' ? styles[size] : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={rootClasses}>
      <input ref={resolvedRef} type="checkbox" className={styles.input} {...inputProps} />
      <span className={styles.box} />
      <span className={styles.label}>{label}</span>
    </label>
  );
});
