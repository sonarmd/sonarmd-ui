import React from 'react';
import styles from './Stepper.module.css';

export interface Step {
  label: React.ReactNode;
  description?: React.ReactNode;
}

export interface StepperProps {
  steps: Step[];
  /** Index of the active step (0-based). Earlier steps render as complete. */
  activeStep: number;
  /** When provided, completed and current steps become navigable buttons. */
  onStepClick?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
  /** Accessible name for the step list. Default "Progress". */
  ariaLabel?: string;
  className?: string;
}

function CheckIcon(): React.JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3 3 6-6.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type StepStatus = 'complete' | 'current' | 'upcoming';

/**
 * A multi-step progress indicator for intake and approval flows. Renders an
 * ordered list; the active step carries aria-current="step"; completed steps
 * show a check. Pass `onStepClick` to let users jump back to completed/current
 * steps (those become buttons; upcoming steps stay non-interactive).
 */
export function Stepper({
  steps,
  activeStep,
  onStepClick,
  orientation = 'horizontal',
  ariaLabel = 'Progress',
  className,
}: StepperProps): React.JSX.Element {
  const classes = [styles.stepper, styles[orientation], className].filter(Boolean).join(' ');

  return (
    <ol className={classes} aria-label={ariaLabel}>
      {steps.map((step, i) => {
        const status: StepStatus = i < activeStep ? 'complete' : i === activeStep ? 'current' : 'upcoming';
        const navigable = onStepClick != null && status !== 'upcoming';

        const indicator = (
          <span className={styles.indicator} aria-hidden="true">
            {status === 'complete' ? <CheckIcon /> : i + 1}
          </span>
        );
        const text = (
          <span className={styles.text}>
            <span className={styles.label}>{step.label}</span>
            {step.description && <span className={styles.description}>{step.description}</span>}
          </span>
        );

        return (
          <li
            key={i}
            className={`${styles.step} ${styles[status]}`}
            aria-current={status === 'current' ? 'step' : undefined}
          >
            {navigable ? (
              <button type="button" className={styles.content} onClick={() => onStepClick(i)}>
                {indicator}
                {text}
              </button>
            ) : (
              <span className={styles.content}>
                {indicator}
                {text}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
