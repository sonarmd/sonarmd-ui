import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { FieldWrapper } from '../FieldWrapper';
import styles from './TextArea.module.css';

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  autoResize?: boolean;
  maxRows?: number;
  minRows?: number;
}

export const TextArea = React.memo(
  React.forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
    {
      label,
      error,
      hint,
      size = 'md',
      required,
      autoResize = false,
      maxRows = 10,
      minRows = 3,
      id,
      name,
      className,
      style,
      onInput,
      ...textareaProps
    },
    forwardedRef,
  ) {
    const innerRef = useRef<HTMLTextAreaElement>(null);
    const lineHeightRef = useRef<number>(20);

    const resolvedRef = (forwardedRef as React.RefObject<HTMLTextAreaElement>) ?? innerRef;

    const textareaId = useMemo(
      () => id ?? (name ? `textarea-${name}` : undefined),
      [id, name],
    );

    const ariaDescribedBy = useMemo(
      () =>
        error && textareaId
          ? `${textareaId}-error`
          : hint && textareaId
            ? `${textareaId}-hint`
            : undefined,
      [error, hint, textareaId],
    );

    const textareaClasses = useMemo(
      () =>
        [styles.textarea, autoResize ? styles.autoResize : ''].filter(Boolean).join(' '),
      [autoResize],
    );

    const resize = useCallback(() => {
      const el = resolvedRef.current;
      if (!el || !autoResize) return;

      const style = window.getComputedStyle(el);
      const lineHeight = parseFloat(style.lineHeight) || 20;
      lineHeightRef.current = lineHeight;

      const paddingTop = parseFloat(style.paddingTop) || 0;
      const paddingBottom = parseFloat(style.paddingBottom) || 0;

      const minHeight = minRows * lineHeight + paddingTop + paddingBottom;
      const maxHeight = maxRows * lineHeight + paddingTop + paddingBottom;

      el.style.height = 'auto';
      const scrollHeight = el.scrollHeight;
      el.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
    }, [autoResize, maxRows, minRows, resolvedRef]);

    useEffect(() => {
      resize();
    }, [resize, textareaProps.value, textareaProps.defaultValue]);

    const handleInput = useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        resize();
        onInput?.(e);
      },
      [resize, onInput],
    );

    return (
      <FieldWrapper
        label={label}
        htmlFor={textareaId}
        required={required}
        error={error}
        hint={hint}
        className={className}
      >
        <textarea
          ref={resolvedRef}
          id={textareaId}
          name={name}
          className={textareaClasses}
          rows={minRows}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
          required={required}
          onInput={handleInput}
          style={style}
          {...textareaProps}
        />
      </FieldWrapper>
    );
  }),
);

TextArea.displayName = 'TextArea';
