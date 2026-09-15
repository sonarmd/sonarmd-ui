import React from 'react';
import type {Story} from '@ladle/react';
import {Form} from '../components/Form/Form';
import {TextInput} from '../components/TextInput/TextInput';
import {Button} from '../components/Button/Button';
import {FormSection} from '../components/FormSection/FormSection';
import {FormActions} from '../components/FormActions/FormActions';
import {Stack} from '../components/Stack/Stack';

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
