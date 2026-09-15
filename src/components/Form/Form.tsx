import React from 'react';

export interface FormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Pair with useForm().handleSubmit(...). */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * Thin form element. `noValidate` hands validation to useForm so error UX is
 * consistent and accessible rather than relying on native browser bubbles.
 */
export const Form = React.memo(
  React.forwardRef<HTMLFormElement, FormProps>(function Form(
    {onSubmit, children, ...rest},
    ref,
  ) {
    return (
      <form ref={ref} noValidate onSubmit={onSubmit} {...rest}>
        {children}
      </form>
    );
  }),
);

Form.displayName = 'Form';
