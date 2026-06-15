import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {Radio} from './index';

export const Default: Story = () => (
  <Radio label="Active" value="active" name="status" />
);

export const Checked: Story = () => (
  <Radio label="Active" value="active" name="status" defaultChecked />
);

export const Controlled: Story = () => {
  const [value, setValue] = useState('active');
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
      {['active', 'review', 'closed'].map((opt) => (
        <Radio
          key={opt}
          label={opt.charAt(0).toUpperCase() + opt.slice(1)}
          value={opt}
          name="status-controlled"
          checked={value === opt}
          onChange={(e) => setValue((e.target as HTMLInputElement).value)}
        />
      ))}
    </div>
  );
};

export const Disabled: Story = () => (
  <Radio label="Inactive" value="inactive" name="status-d" disabled />
);
