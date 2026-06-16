import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {Modal} from './index';
import {Button} from '../Button';

function ModalDemo({size, title}: {size?: 'sm' | 'md' | 'lg' | 'xl'; title: string}): React.JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open {title}</Button>
      <Modal open={open} onClose={() => setOpen(false)} title={title} size={size}>
        <p>Modal content goes here. This is a {size ?? 'md'} modal.</p>
        <p>Press Escape or click outside to close.</p>
      </Modal>
    </>
  );
}

export const Small: Story = () => <ModalDemo size="sm" title="Small Modal" />;
export const Medium: Story = () => <ModalDemo size="md" title="Medium Modal" />;
export const Large: Story = () => <ModalDemo size="lg" title="Large Modal" />;

export const WithFooter: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open with Footer</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm Action"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
          </>
        }
      >
        <p>Are you sure you want to proceed with this action?</p>
      </Modal>
    </>
  );
};
