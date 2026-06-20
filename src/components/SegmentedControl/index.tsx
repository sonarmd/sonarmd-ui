import React, {useCallback, useId, useRef} from 'react';
import styles from './SegmentedControl.module.css';

export interface SegmentedOption<V extends string = string> {
  value: V;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<V extends string = string> {
  options: SegmentedOption<V>[];
  value: V;
  onChange: (value: V) => void;
  size?: 'sm' | 'md';
  /** Stretch segments to fill the container width. */
  fullWidth?: boolean;
  /** Accessible name for the group (e.g. "View mode"). */
  ariaLabel?: string;
  className?: string;
}

/**
 * A compact single-select toggle for view modes and time ranges (list/grid,
 * day/week/month). Implements the radiogroup pattern with button segments: one
 * tab stop, Arrow/Home/End move and select, aria-checked tracks the choice -
 * distinct from RadioGroup, which is a labelled form field of native inputs.
 */
export function SegmentedControl<V extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  ariaLabel,
  className,
}: SegmentedControlProps<V>): React.JSX.Element {
  const baseId = useId();
  const refs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const enabled = options.filter((o) => !o.disabled);
      const idx = enabled.findIndex((o) => o.value === value);
      let next = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % enabled.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + enabled.length) % enabled.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = enabled.length - 1;
      else return;
      e.preventDefault();
      const target = enabled[next];
      onChange(target.value);
      refs.current.get(target.value)?.focus();
    },
    [options, value, onChange],
  );

  const classes = [styles.group, styles[size], fullWidth ? styles.fullWidth : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div role="radiogroup" aria-label={ariaLabel} className={classes} onKeyDown={handleKeyDown}>
      {options.map((opt) => {
        const checked = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              if (el) refs.current.set(opt.value, el);
              else refs.current.delete(opt.value);
            }}
            type="button"
            id={`${baseId}-${opt.value}`}
            role="radio"
            aria-checked={checked}
            disabled={opt.disabled}
            tabIndex={checked ? 0 : -1}
            className={styles.segment}
            onClick={() => onChange(opt.value)}
          >
            {opt.icon && <span className={styles.icon}>{opt.icon}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
