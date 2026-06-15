import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {MultiSelect} from './index';
import type {DropdownOption} from '../Dropdown';

const conditionOptions: DropdownOption[] = [
  {value: 'diabetes', label: 'Diabetes'},
  {value: 'chf', label: 'CHF'},
  {value: 'ckd', label: 'CKD'},
  {value: 'copd', label: 'COPD'},
  {value: 'cad', label: 'CAD'},
  {value: 'hypertension', label: 'Hypertension'},
];

export const Default: Story = () => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MultiSelect
      label="Conditions"
      options={conditionOptions}
      value={value}
      onChange={setValue}
      placeholder="Select conditions..."
    />
  );
};

export const WithPreselected: Story = () => {
  const [value, setValue] = useState<string[]>(['diabetes', 'chf']);
  return (
    <MultiSelect label="Conditions" options={conditionOptions} value={value} onChange={setValue} searchable />
  );
};

export const WithMaxSelections: Story = () => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MultiSelect
      label="Top 3 Conditions"
      options={conditionOptions}
      value={value}
      onChange={setValue}
      maxSelections={3}
      hint="Select up to 3 conditions."
    />
  );
};
