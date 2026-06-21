import React, {useMemo} from 'react';
import styles from './Progress.module.css';
import {sonarFC} from '../../internal/sonarFC';

export type ProgressTone = 'primary' | 'success' | 'warning' | 'danger';

export interface ProgressProps {
  /**
   * Completion 0..max. Omit for an indeterminate bar (unknown duration), which
   * animates continuously and exposes no aria-valuenow.
   */
  value?: number;
  max?: number;
  tone?: ProgressTone;
  size?: 'sm' | 'md';
  /** Accessible name for the progress bar (e.g. "Uploading report"). */
  label?: string;
  /** Render the percentage as visible text alongside the track. */
  showValue?: boolean;
  className?: string;
}

function clampPct(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, (value / max) * 100));
}

/**
 * A linear progress indicator. Determinate when `value` is provided
 * (exposes role="progressbar" with aria-valuenow/min/max); indeterminate
 * otherwise. Animation respects prefers-reduced-motion centrally.
 */
export const Progress = sonarFC<HTMLDivElement, ProgressProps>(
  'Progress',
  (
  {value, max = 100, tone = 'primary', size = 'md', label, showValue = false, className},
  ref,
) => {
  const indeterminate = value == null;
  const pct = useMemo(() => (indeterminate ? 0 : clampPct(value, max)), [indeterminate, value, max]);

  const trackClasses = [styles.track, styles[size], className].filter(Boolean).join(' ');
  const fillClasses = [styles.fill, styles[tone], indeterminate ? styles.indeterminate : '']
    .filter(Boolean)
    .join(' ');

  // Expose the same clamped value the bar paints, so assistive tech never
  // receives a number outside the advertised [0, max] range.
  const valueNow = value == null ? undefined : Math.max(0, Math.min(max, value));

  return (
    <div className={styles.wrapper}>
      <div
        ref={ref}
        className={trackClasses}
        role="progressbar"
        aria-label={label}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={valueNow}
      >
        <div className={fillClasses} style={indeterminate ? undefined : {width: `${pct}%`}} />
      </div>
      {showValue && !indeterminate && (
        <span className={styles.value}>{Math.round(pct)}%</span>
      )}
    </div>
  );
  },
);
