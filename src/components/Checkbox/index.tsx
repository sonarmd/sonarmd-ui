import React, { useEffect, useRef, useMemo } from 'react';
import styles from './Checkbox.module.css';
import {sonarFC} from '../../internal/sonarFC';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
}

export const Checkbox = React.memo(
  sonarFC<HTMLInputElement, CheckboxProps>('Checkbox', (
    { label, size = 'md', indeterminate, className, ...inputProps },
    forwardedRef,
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);
    const resolvedRef = (forwardedRef as React.RefObject<HTMLInputElement>) ?? innerRef;

    useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate ?? false;
      }
    }, [indeterminate, resolvedRef]);

    const rootClasses = useMemo(
      () =>
        [styles.root, size !== 'md' ? styles[size] : '', className].filter(Boolean).join(' '),
      [size, className],
    );

    return (
      <label className={rootClasses}>
        <input ref={resolvedRef} type="checkbox" className={styles.input} {...inputProps} />
        <span className={styles.box} />
        <span className={styles.label}>{label}</span>
      </label>
    );
  }),
);
