import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {ConfirmDialog} from './index';
import {Button} from '../Button';

export const DangerVariant: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>Delete Patient</Button>
      <ConfirmDialog
        open={open}
        onConfirm={() => { setOpen(false); }}
        onCancel={() => setOpen(false)}
        title="Delete patient record"
        message="This action cannot be undone. All associated data will be permanently removed."
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
};

export const PrimaryVariant: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>Archive</Button>
      <ConfirmDialog
        open={open}
        onConfirm={() => { setOpen(false); }}
        onCancel={() => setOpen(false)}
        title="Archive patient"
        message="The patient will be moved to the archive and will no longer appear in active lists."
        confirmLabel="Archive"
        variant="primary"
      />
    </>
  );
};
