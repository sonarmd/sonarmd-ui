import React from 'react';
import type {Story} from '@ladle/react';
import {ToastProvider, useToast} from './index';
import {Button} from '../Button';

function ToastDemo(): React.JSX.Element {
  const {addToast} = useToast();

  return (
    <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
      <Button variant="ghost" onClick={() => addToast({variant: 'info', message: 'Patient record saved.'})}>
        Info
      </Button>
      <Button variant="ghost" onClick={() => addToast({variant: 'success', title: 'Saved', message: 'Changes have been saved.'})}>
        Success
      </Button>
      <Button variant="ghost" onClick={() => addToast({variant: 'warning', message: 'Session expires in 5 minutes.'})}>
        Warning
      </Button>
      <Button variant="ghost" onClick={() => addToast({variant: 'error', message: 'Failed to save. Please try again.'})}>
        Error
      </Button>
      <Button variant="ghost" onClick={() => addToast({
        variant: 'info',
        message: 'Export ready.',
        action: {label: 'Download', onClick: () => {}},
      })}>
        With Action
      </Button>
    </div>
  );
}

export const Default: Story = () => (
  <ToastProvider position="top-right">
    <ToastDemo />
  </ToastProvider>
);

export const BottomLeft: Story = () => (
  <ToastProvider position="bottom-left">
    <ToastDemo />
  </ToastProvider>
);
