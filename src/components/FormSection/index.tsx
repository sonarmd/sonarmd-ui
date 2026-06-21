import React, {useMemo} from 'react';
import styles from './FormSection.module.css';
import {sonarFC} from '../../internal/sonarFC';

export interface FormSectionProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** Section heading, rendered as a real <legend> for grouping semantics. */
  title?: string;
  /** Optional supporting copy under the heading. */
  description?: string;
}

/**
 * Groups related fields in a semantic fieldset/legend. The legend gives screen
 * readers a group name for every control inside, satisfying WCAG grouping.
 */
export const FormSection = React.memo(
  sonarFC<HTMLFieldSetElement, FormSectionProps>('FormSection', (
    {title, description, className, children, ...rest},
    ref,
  ) => {
    const classes = useMemo(
      () => [styles.section, className].filter(Boolean).join(' '),
      [className],
    );

    return (
      <fieldset ref={ref} className={classes} {...rest}>
        {title && <legend className={styles.legend}>{title}</legend>}
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.body}>{children}</div>
      </fieldset>
    );
  }),
);
