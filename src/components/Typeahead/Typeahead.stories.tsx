import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {Typeahead} from './index';
import type {TypeaheadOption} from './index';

const patients: TypeaheadOption[] = [
  {value: 'p1', label: 'Jane Smith'},
  {value: 'p2', label: 'Michael Chen'},
  {value: 'p3', label: 'Alice Johnson'},
  {value: 'p4', label: 'Robert Davis'},
];

const loadPatients = async (query: string, signal: AbortSignal): Promise<TypeaheadOption[]> => {
  await new Promise((r) => setTimeout(r, 200));
  if (signal.aborted) return [];
  return patients.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()));
};

export const Default: Story = () => {
  const [value, setValue] = useState<TypeaheadOption | null>(null);
  return (
    <Typeahead label="Patient" value={value} onChange={setValue} loadOptions={loadPatients} placeholder="Search patients..." />
  );
};

export const WithValue: Story = () => {
  const [value, setValue] = useState<TypeaheadOption | null>({value: 'p1', label: 'Jane Smith'});
  return (
    <Typeahead label="Patient" value={value} onChange={setValue} loadOptions={loadPatients} clearable />
  );
};

export const WithError: Story = () => {
  const [value, setValue] = useState<TypeaheadOption | null>(null);
  return (
    <Typeahead
      label="Patient"
      value={value}
      onChange={setValue}
      loadOptions={loadPatients}
      error="Please select a patient."
      required
    />
  );
};
