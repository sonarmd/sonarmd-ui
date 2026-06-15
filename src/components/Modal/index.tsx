import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { usePortal } from '../../hooks/usePortal';
import { Button } from '../Button';
import styles from './Modal.module.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

function CloseIcon(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 2l12 12M14 2L2 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a, button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export const Modal = React.memo(function Modal({
  open,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps): JSX.Element | null {
  const modalRef = useRef<HTMLDivElement | null>(null);
  // Rule 6: previously focused element stored in ref, not state
  const prevFocusRef = useRef<HTMLElement | null>(null);
  // Rule 6: focusable elements cached in ref to avoid repeated DOM queries in the Tab handler
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  const portalEl = usePortal();

  // Lock body scroll when open; restore on cleanup
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape key handler
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, closeOnEscape, onClose]);

  // Store previously focused element; restore focus on close
  useEffect(() => {
    if (open) {
      prevFocusRef.current = document.activeElement as HTMLElement;
    } else {
      prevFocusRef.current?.focus();
    }
  }, [open]);

  // Focus first focusable element when modal opens; prime the ref cache
  useEffect(() => {
    if (!open || !modalRef.current) return;
    focusableElementsRef.current = getFocusableElements(modalRef.current);
    if (focusableElementsRef.current.length > 0) {
      focusableElementsRef.current[0].focus();
    }
  }, [open]);

  // Focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !modalRef.current) return;
    const focusable = focusableElementsRef.current;
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose],
  );

  const handleCloseClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!open) return null;

  const modalClasses = [styles.modal, styles[size]].join(' ');

  return ReactDOM.createPortal(
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={modalClasses}
        onKeyDown={handleKeyDown}
      >
        {(title != null) && (
          <div className={styles.header}>
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
            <Button
              square
              variant="ghost"
              size="sm"
              onClick={handleCloseClick}
              aria-label="Close dialog"
            >
              <CloseIcon />
            </Button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    portalEl,
  );
});
