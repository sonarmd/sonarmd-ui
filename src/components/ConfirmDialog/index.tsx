import React from 'react';
import { Modal } from '../Modal';
import styles from './ConfirmDialog.module.css';

export interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

function Spinner(): JSX.Element {
  return <span className={styles.spinner} aria-hidden="true" />;
}

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps): JSX.Element {
  const confirmClasses = [styles.confirmBtn, styles[variant]].filter(Boolean).join(' ');

  const footer = (
    <>
      <button
        type="button"
        className={styles.cancelBtn}
        onClick={onCancel}
        disabled={loading}
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        className={confirmClasses}
        onClick={onConfirm}
        disabled={loading}
        aria-busy={loading}
      >
        {loading && <Spinner />}
        {confirmLabel}
      </button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={footer}
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
    >
      <div className={styles.message}>{message}</div>
    </Modal>
  );
}
