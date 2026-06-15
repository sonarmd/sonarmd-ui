import React, {useCallback} from 'react';
import {Modal} from '../Modal';
import {Button} from '../Button';
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
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const footer = (
    <>
      <Button variant="ghost" onClick={handleCancel} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button variant={variant} onClick={handleConfirm} loading={loading}>
        {confirmLabel}
      </Button>
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
