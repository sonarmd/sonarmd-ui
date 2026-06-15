import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {Tabs} from './index';
import type {Tab} from './index';

const tabs: Tab[] = [
  {key: 'overview', label: 'Overview'},
  {key: 'gaps', label: 'Care Gaps', badge: 3},
  {key: 'encounters', label: 'Encounters'},
  {key: 'notes', label: 'Notes', disabled: true},
];

export const Underline: Story = () => {
  const [active, setActive] = useState('overview');
  return (
    <div>
      <Tabs tabs={tabs} activeTab={active} onChange={setActive} />
      <div style={{padding: 16, color: 'var(--smd-text-secondary)'}}>
        Active: {active}
      </div>
    </div>
  );
};

export const Pills: Story = () => {
  const [active, setActive] = useState('overview');
  return (
    <Tabs tabs={tabs} activeTab={active} onChange={setActive} variant="pills" />
  );
};

export const Small: Story = () => {
  const [active, setActive] = useState('overview');
  return (
    <Tabs tabs={tabs} activeTab={active} onChange={setActive} size="sm" />
  );
};
