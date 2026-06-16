/**
 * Recipe 3: Form with validation
 *
 * useForm + FormSection + FormErrorSummary + SecureField (PHI input).
 * useForm uses a register() pattern: `register('fieldName', rules)` returns
 * the binding props to spread onto the input.
 */
import React from 'react';
import {useForm} from '../../src/hooks/useForm';
import {FormSection} from '../../src/components/FormSection';
import {FormErrorSummary} from '../../src/components/FormErrorSummary';
import {SecureField} from '../../src/components/SecureField';
import {TextInput} from '../../src/components/TextInput';
import {Button} from '../../src/components/Button';
import {Stack} from '../../src/components/Stack';

interface PatientForm extends Record<string, unknown> {
  firstName: string;
  lastName: string;
  dob: string;
  mrn: string;
}

export function PatientForm(): React.JSX.Element {
  const form = useForm<PatientForm>({
    defaultValues: {firstName: '', lastName: '', dob: '', mrn: ''},
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    // PHI: send over TLS, never log
    await fetch('/api/patients', {
      method: 'POST',
      body: JSON.stringify(values),
    });
  });

  const firstName = form.useField('firstName');
  const lastName = form.useField('lastName');
  const dob = form.useField('dob');
  const mrn = form.useField('mrn');

  return (
    <form onSubmit={(e) => handleSubmit(e)} noValidate>
      <FormErrorSummary form={form} labels={{firstName: 'First Name', lastName: 'Last Name', dob: 'Date of Birth', mrn: 'MRN'}} />
      <FormSection title="Demographics">
        <Stack gap="3">
          <TextInput
            label="First Name"
            error={firstName.error}
            required
            {...form.register('firstName', {required: true})}
          />
          <TextInput
            label="Last Name"
            error={lastName.error}
            required
            {...form.register('lastName', {required: true})}
          />
          <TextInput
            label="Date of Birth"
            type="date"
            error={dob.error}
            required
            {...form.register('dob', {required: true})}
          />
        </Stack>
      </FormSection>
      <FormSection title="Identifiers">
        <SecureField
          label="Medical Record Number (MRN)"
          error={mrn.error}
          required
          {...form.register('mrn', {required: true, validate: (v) => String(v).length < 6 ? 'MRN must be at least 6 characters.' : undefined})}
        />
      </FormSection>
      <Button type="submit" variant="primary">
        Save Patient
      </Button>
    </form>
  );
}
