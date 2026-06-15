import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {RadioGroup} from './index';
import type {RadioGroupOption} from './index';

const statusOptions: RadioGroupOption[] = [
  {value: 'active', label: 'Active'},
  {value: 'review', label: 'Review'},
  {value: 'closed', label: 'Closed'},
];

export const Default: Story = () => (
  <RadioGroup name="status" label="Patient Status" options={statusOptions} value="active" onChange={() => {}} />
);

export const Controlled: Story = () => {
  const [value, setValue] = useState('active');
  return (
    <RadioGroup name="status" label="Patient Status" options={statusOptions} value={value} onChange={setValue} />
  );
};

export const Horizontal: Story = () => (
  <RadioGroup
    name="status"
    label="Patient Status"
    options={statusOptions}
    orientation="horizontal"
    value="active"
    onChange={() => {}}
  />
);

export const WithError: Story = () => (
  <RadioGroup
    name="status"
    label="Patient Status"
    options={statusOptions}
    error="Please select a status."
    value=""
    onChange={() => {}}
  />
);
