import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {FilterBar} from './index';
import {Select} from '../Select';
import {TextInput} from '../TextInput';

export const Default: Story = () => (
  <FilterBar>
    <Select
      label="Status"
      options={[
        {value: '', label: 'All Statuses'},
        {value: 'active', label: 'Active'},
        {value: 'review', label: 'Review'},
      ]}
    />
    <TextInput label="Patient Name" placeholder="Search..." />
  </FilterBar>
);

export const WithActiveFilters: Story = () => {
  const [count, setCount] = useState(2);
  return (
    <FilterBar activeFilterCount={count} onClear={() => setCount(0)}>
      <Select
        label="Status"
        options={[
          {value: 'active', label: 'Active'},
          {value: 'review', label: 'Review'},
        ]}
        value="active"
      />
      <TextInput label="Patient Name" value="Smith" />
    </FilterBar>
  );
};
