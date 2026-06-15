import React from 'react';
import type {Story} from '@ladle/react';
import {FormSection} from './index';
import {TextInput} from '../TextInput';
import {Stack} from '../Stack';

export const Default: Story = () => (
  <FormSection title="Demographics">
    <Stack gap="3">
      <TextInput label="First Name" required />
      <TextInput label="Last Name" required />
    </Stack>
  </FormSection>
);

export const WithDescription: Story = () => (
  <FormSection title="PHI Identifiers" description="This section contains protected health information. Handle per HIPAA guidelines.">
    <Stack gap="3">
      <TextInput label="MRN" required />
      <TextInput label="SSN" type="password" />
    </Stack>
  </FormSection>
);
