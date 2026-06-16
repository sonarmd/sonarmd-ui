import React from 'react';
import type {Story} from '@ladle/react';
import {FormErrorSummary} from './index';
import {useForm} from '../../hooks/useForm';
import {Button} from '../Button';
import {TextInput} from '../TextInput';

function DemoForm(): React.JSX.Element {
  const form = useForm<Record<string, unknown>>({
    defaultValues: {firstName: '', lastName: '', dob: ''},
  });

  const handleSubmit = form.handleSubmit(() => {
    // intentionally empty
  });

  return (
    <form onSubmit={handleSubmit} noValidate style={{maxWidth: 400}}>
      <FormErrorSummary form={form} labels={{firstName: 'First Name', lastName: 'Last Name', dob: 'Date of Birth'}} />
      <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12}}>
        <TextInput label="First Name" required {...form.register('firstName', {required: true})} />
        <TextInput label="Last Name" required {...form.register('lastName', {required: true})} />
        <TextInput label="Date of Birth" type="date" required {...form.register('dob', {required: true})} />
      </div>
      <Button type="submit" variant="primary" style={{marginTop: 16}}>Submit (triggers errors)</Button>
    </form>
  );
}

export const Default: Story = () => <DemoForm />;
