import React, {useRef, useEffect, useMemo, useSyncExternalStore} from 'react';
import type {UseFormReturn} from '../../hooks/useForm';
import styles from './FormErrorSummary.module.css';

export interface FormErrorSummaryProps {
  /** The form controller from useForm(). */
  form: UseFormReturn<Record<string, unknown>>;
  /** Human labels per field name, used in the summary list. */
  labels?: Record<string, string>;
  /** Heading text. */
  title?: string;
}

/**
 * Accessible error summary. On a failed submit it lists every error, moves
 * focus to itself (WCAG 3.3), and each entry focuses its field by name.
 */
export const FormErrorSummary = React.memo(function FormErrorSummary({
  form,
  labels,
  title = 'Please fix the following before continuing:',
}: FormErrorSummaryProps): React.JSX.Element | null {
  const ref = useRef<HTMLDivElement>(null);
  const {store} = form;

  const snapshot = useSyncExternalStore(store.subscribe, () => store.state);

  const entries = useMemo(
    () =>
      Object.entries(snapshot.errors).filter(
        (e): e is [string, string] => Boolean(e[1]),
      ),
    [snapshot.errors],
  );

  const submitCount = snapshot.submitCount;
  useEffect(() => {
    if (submitCount > 0 && entries.length > 0) ref.current?.focus();
  }, [submitCount, entries.length]);

  if (entries.length === 0) return null;

  const focusField = (name: string): void => {
    const el = document.querySelector<HTMLElement>(`[name="${name}"]`);
    el?.focus();
  };

  return (
    <div
      ref={ref}
      className={styles.summary}
      role="alert"
      aria-labelledby="smd-error-summary-title"
      tabIndex={-1}
    >
      <p id="smd-error-summary-title" className={styles.title}>
        {title}
      </p>
      <ul className={styles.list}>
        {entries.map(([name, message]) => (
          <li key={name}>
            <button type="button" className={styles.link} onClick={() => focusField(name)}>
              {labels?.[name] ? `${labels[name]}: ${message}` : message}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

FormErrorSummary.displayName = 'FormErrorSummary';
