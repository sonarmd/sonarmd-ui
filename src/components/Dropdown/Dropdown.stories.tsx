import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {Dropdown} from './index';
import type {DropdownOption} from './index';

const statusOptions: DropdownOption[] = [
  {value: 'active', label: 'Active'},
  {value: 'review', label: 'Review'},
  {value: 'closed', label: 'Closed'},
  {value: 'inactive', label: 'Inactive', disabled: true},
];

export const Default: Story = () => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Dropdown label="Status" options={statusOptions} value={value} onChange={setValue} placeholder="Select status..." />
  );
};

export const Searchable: Story = () => {
  const [value, setValue] = useState<string | null>('active');
  return (
    <Dropdown label="Status" options={statusOptions} value={value} onChange={setValue} searchable clearable />
  );
};

export const WithError: Story = () => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Dropdown
      label="Status"
      options={statusOptions}
      value={value}
      onChange={setValue}
      error="Please select a status."
      required
    />
  );
};

export const Disabled: Story = () => (
  <Dropdown label="Status" options={statusOptions} value="active" onChange={() => {}} disabled />
);
