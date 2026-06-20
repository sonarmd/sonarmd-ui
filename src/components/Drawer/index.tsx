import React, {useCallback, useId} from 'react';
import ReactDOM from 'react-dom';
import {usePortal} from '../../hooks/usePortal';
import {useDialogA11y} from '../../hooks/useDialogA11y';
import {Button} from '../Button';
import styles from './Drawer.module.css';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
  /** Controls visibility. When false the drawer renders nothing. */
  open: boolean;
  /** Called on dismiss (overlay click, Escape, close button). */
  onClose: () => void;
  /** Edge the panel slides in from. Default 'right'. */
  side?: DrawerSide;
  /** Visible heading; also the dialog's accessible name via aria-labelledby. */
  title?: string;
  /** Accessible name when no visible `title` is rendered (a dialog must be named). */
  ariaLabel?: string;
  /** Panel extent along its slide axis. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

function CloseIcon(): React.JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * A slide-in panel anchored to a screen edge - for filters, detail views, and
 * settings on compact layouts. Shares all dialog accessibility (focus trap,
 * focus restore, background inert, Escape, scroll lock) with Modal via
 * useDialogA11y; the panel slides from `side` (reduced-motion handled centrally).
 */
export const Drawer = React.memo(function Drawer({
  open,
  onClose,
  side = 'right',
  title,
  ariaLabel,
  size = 'md',
  children,
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: DrawerProps): React.JSX.Element | null {
  const titleId = useId();
  const portalEl = usePortal();
  const {containerRef, onKeyDown} = useDialogA11y<HTMLDivElement>({
    open,
    onClose,
    portalEl,
    closeOnEscape,
  });

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) onClose();
    },
    [closeOnOverlayClick, onClose],
  );

  if (!open) return null;

  const panelClasses = [styles.panel, styles[side], styles[size]].join(' ');

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        ref={containerRef}
        className={panelClasses}
        onKeyDown={onKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        aria-label={title == null ? ariaLabel : undefined}
      >
        {title != null && (
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <Button square variant="ghost" size="sm" onClick={onClose} aria-label="Close">
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
