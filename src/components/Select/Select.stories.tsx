import React from 'react';
import type {Story} from '@ladle/react';
import {Select} from './index';
import type {SelectOption} from './index';

const statusOptions: SelectOption[] = [
  {value: 'active', label: 'Active'},
  {value: 'review', label: 'Review'},
  {value: 'closed', label: 'Closed'},
];

export const Default: Story = () => (
  <Select label="Status" options={statusOptions} />
);

export const WithPlaceholder: Story = () => (
  <Select label="Status" options={statusOptions} placeholder="Select a status..." />
);

export const Sizes: Story = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
    <Select label="Small" size="sm" options={statusOptions} />
    <Select label="Medium (default)" size="md" options={statusOptions} />
    <Select label="Large" size="lg" options={statusOptions} />
  </div>
);

export const WithError: Story = () => (
  <Select label="Status" options={statusOptions} error="Please select a status." required />
);
