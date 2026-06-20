import React, { useCallback, useEffect, useId, useRef } from 'react';
import ReactDOM from 'react-dom';
import { usePortal } from '../../hooks/usePortal';
import { Button } from '../Button';
import styles from './Modal.module.css';

export interface ModalProps {
  /** Controls visibility. When false the modal renders nothing. */
  open: boolean;
  /** Called when the user dismisses the dialog (overlay click, Escape, close button). */
  onClose: () => void;
  /** Visible heading; also becomes the dialog's accessible name via aria-labelledby. */
  title?: string;
  /**
   * Accessible name when no visible `title` is rendered. Required for an
   * accessible dialog if `title` is omitted (a dialog must have a name).
   */
  ariaLabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

function CloseIcon(): React.JSX.Element {
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
  ariaLabel,
  size = 'md',
  children,
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps): React.JSX.Element | null {
  const titleId = useId();
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

  // Contain assistive-tech navigation to the dialog: mark every sibling of the
  // dialog's portal as inert while open, so the virtual cursor cannot leak into
  // background content. Restored exactly to its prior state on close. Only nodes
  // this effect changed are reverted, so nested dialogs compose correctly.
  useEffect(() => {
    if (!open) return;
    const changed: HTMLElement[] = [];
    for (const node of Array.from(document.body.children)) {
      if (!(node instanceof HTMLElement) || node.contains(portalEl) || node === portalEl) continue;
      if (node.inert) continue;
      node.inert = true;
      node.setAttribute('aria-hidden', 'true');
      changed.push(node);
    }
    return () => {
      for (const node of changed) {
        node.inert = false;
        node.removeAttribute('aria-hidden');
      }
    };
  }, [open, portalEl]);

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
      aria-labelledby={title != null ? titleId : undefined}
      aria-label={title == null ? ariaLabel : undefined}
    >
      <div
        ref={modalRef}
        className={modalClasses}
        onKeyDown={handleKeyDown}
      >
        {(title != null) && (
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
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
