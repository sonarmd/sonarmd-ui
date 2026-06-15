import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {Checkbox} from './index';

export const Default: Story = () => (
  <Checkbox label="Enable notifications" />
);

export const Checked: Story = () => (
  <Checkbox label="Active" defaultChecked />
);

export const Indeterminate: Story = () => (
  <Checkbox label="Select all" indeterminate />
);

export const Disabled: Story = () => (
  <Checkbox label="Disabled" disabled />
);

export const Sizes: Story = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
    <Checkbox label="Small" size="sm" />
    <Checkbox label="Medium (default)" size="md" />
    <Checkbox label="Large" size="lg" />
  </div>
);

export const Controlled: Story = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label={checked ? 'Checked' : 'Unchecked'}
      checked={checked}
      onChange={(e) => setChecked((e.target as HTMLInputElement).checked)}
    />
  );
};
