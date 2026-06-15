import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {CheckboxGroup} from './index';
import type {CheckboxGroupOption} from './index';

const options: CheckboxGroupOption[] = [
  {value: 'hcc', label: 'HCC Risk'},
  {value: 'readmission', label: 'Readmission Risk'},
  {value: 'gaps', label: 'Care Gaps'},
];

export const Default: Story = () => (
  <CheckboxGroup label="Alert Types" options={options} value={[]} onChange={() => {}} />
);

export const Controlled: Story = () => {
  const [value, setValue] = useState<string[]>(['hcc']);
  return (
    <CheckboxGroup label="Alert Types" options={options} value={value} onChange={setValue} />
  );
};

export const Horizontal: Story = () => (
  <CheckboxGroup
    label="Alert Types"
    options={options}
    orientation="horizontal"
    value={[]}
    onChange={() => {}}
  />
);

export const WithError: Story = () => (
  <CheckboxGroup
    label="Alert Types"
    options={options}
    error="Select at least one alert type."
    value={[]}
    onChange={() => {}}
  />
);
