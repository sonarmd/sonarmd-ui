import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {DatePicker} from './index';

export const Default: Story = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <DatePicker label="Date of Birth" value={value} onChange={setValue} placeholder="MM/DD/YYYY" />
  );
};

export const WithValue: Story = () => {
  const [value, setValue] = useState<Date | null>(new Date(1952, 2, 14));
  return (
    <DatePicker label="Date of Birth" value={value} onChange={setValue} clearable />
  );
};

export const WithConstraints: Story = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <DatePicker
      label="Service Date"
      value={value}
      onChange={setValue}
      minDate={new Date(2020, 0, 1)}
      maxDate={new Date()}
      hint="Must be within the last 5 years."
    />
  );
};

export const WithError: Story = () => {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <DatePicker label="Date of Birth" value={value} onChange={setValue} error="Please enter a valid date." required />
  );
};
