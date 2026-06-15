import React from 'react';
import type {Story} from '@ladle/react';
import {FormGrid} from './index';
import {TextInput} from '../TextInput';

export const Default: Story = () => (
  <FormGrid>
    <TextInput label="First Name" required />
    <TextInput label="Last Name" required />
    <TextInput label="Date of Birth" type="date" />
    <TextInput label="MRN" />
  </FormGrid>
);

export const ThreeColumns: Story = () => (
  <FormGrid columns={3}>
    <TextInput label="City" />
    <TextInput label="State" />
    <TextInput label="ZIP" />
  </FormGrid>
);
