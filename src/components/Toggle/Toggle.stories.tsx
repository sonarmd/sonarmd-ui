import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {Toggle} from './index';

export const Default: Story = () => {
  const [checked, setChecked] = useState(false);
  return <Toggle label="Enable notifications" checked={checked} onChange={setChecked} />;
};

export const LabelLeft: Story = () => {
  const [checked, setChecked] = useState(true);
  return <Toggle label="Dark mode" checked={checked} onChange={setChecked} labelPosition="left" />;
};

export const Sizes: Story = () => {
  const [sm, setSm] = useState(false);
  const [md, setMd] = useState(true);
  const [lg, setLg] = useState(false);
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      <Toggle label="Small" checked={sm} onChange={setSm} size="sm" />
      <Toggle label="Medium (default)" checked={md} onChange={setMd} size="md" />
      <Toggle label="Large" checked={lg} onChange={setLg} size="lg" />
    </div>
  );
};

export const Disabled: Story = () => (
  <Toggle label="Disabled (on)" checked={true} onChange={() => {}} disabled />
);
