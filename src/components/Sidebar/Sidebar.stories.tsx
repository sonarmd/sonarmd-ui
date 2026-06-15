import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {Sidebar} from './index';
import type {NavItem} from './index';

const navItems: NavItem[] = [
  {key: 'patients', label: 'Patients', badge: 12},
  {key: 'alerts', label: 'Alerts', badge: 3},
  {key: 'reports', label: 'Reports'},
  {
    key: 'settings',
    label: 'Settings',
    children: [
      {key: 'settings-profile', label: 'Profile'},
      {key: 'settings-integrations', label: 'Integrations'},
    ],
  },
];

export const Default: Story = () => {
  const [active, setActive] = useState('patients');
  return (
    <div style={{height: 500, display: 'flex'}}>
      <Sidebar items={navItems} activeKey={active} onNavigate={setActive} />
    </div>
  );
};

export const Collapsed: Story = () => {
  const [active, setActive] = useState('patients');
  return (
    <div style={{height: 500, display: 'flex'}}>
      <Sidebar items={navItems} activeKey={active} onNavigate={setActive} collapsed />
    </div>
  );
};

export const WithHeader: Story = () => {
  const [active, setActive] = useState('patients');
  return (
    <div style={{height: 500, display: 'flex'}}>
      <Sidebar
        items={navItems}
        activeKey={active}
        onNavigate={setActive}
        header={<div style={{padding: '16px', fontWeight: 700}}>SonarMD</div>}
        footer={<div style={{padding: '16px', fontSize: 12, color: 'var(--smd-text-tertiary)'}}>v1.0.0</div>}
      />
    </div>
  );
};
