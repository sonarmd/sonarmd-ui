import React, { useCallback, useId } from 'react';
import ReactDOM from 'react-dom';
import { usePortal } from '../../hooks/usePortal';
import { useDialogA11y } from '../../hooks/useDialogA11y';
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
  const portalEl = usePortal();
  const {containerRef: modalRef, onKeyDown: handleKeyDown} = useDialogA11y<HTMLDivElement>({
    open,
    onClose,
    portalEl,
    closeOnEscape,
  });

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
