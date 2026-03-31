import React, { useCallback, useMemo } from 'react';
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

export const ConfirmDialog = React.memo(function ConfirmDialog({
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
  const confirmClasses = useMemo(
    () => [styles.confirmBtn, styles[variant]].filter(Boolean).join(' '),
    [variant],
  );

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const footer = (
    <>
      <button
        type="button"
        className={styles.cancelBtn}
        onClick={handleCancel}
        disabled={loading}
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        className={confirmClasses}
        onClick={handleConfirm}
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
      onClose={handleCancel}
      title={title}
      size="sm"
      footer={footer}
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
    >
      <div className={styles.message}>{message}</div>
    </Modal>
  );
});
