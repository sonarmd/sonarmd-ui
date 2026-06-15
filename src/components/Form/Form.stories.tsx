import React from 'react';
import type {Story} from '@ladle/react';
import {Form} from './index';
import {TextInput} from '../TextInput';
import {Button} from '../Button';
import {FormSection} from '../FormSection';
import {FormActions} from '../FormActions';
import {Stack} from '../Stack';

export const Default: Story = () => (
  <Form onSubmit={(e) => { e.preventDefault(); }}>
    <FormSection title="Patient">
      <Stack gap="3">
        <TextInput label="First Name" required />
        <TextInput label="Last Name" required />
      </Stack>
    </FormSection>
    <FormActions>
      <Button variant="ghost">Cancel</Button>
      <Button type="submit" variant="primary">Save</Button>
    </FormActions>
  </Form>
);
