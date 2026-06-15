import React from 'react';
import type {Story} from '@ladle/react';
import {FieldWrapper} from './index';

export const Default: Story = () => (
  <FieldWrapper label="Date of Birth" htmlFor="dob">
    <input id="dob" type="date" style={{display: 'block', width: '100%'}} />
  </FieldWrapper>
);

export const Required: Story = () => (
  <FieldWrapper label="MRN" htmlFor="mrn" required>
    <input id="mrn" type="text" style={{display: 'block', width: '100%'}} />
  </FieldWrapper>
);

export const WithHint: Story = () => (
  <FieldWrapper label="NPI Number" htmlFor="npi" hint="10-digit National Provider Identifier">
    <input id="npi" type="text" maxLength={10} style={{display: 'block', width: '100%'}} />
  </FieldWrapper>
);

export const WithError: Story = () => (
  <FieldWrapper label="Email" htmlFor="email" error="Please enter a valid email address." required>
    <input id="email" type="email" aria-invalid="true" style={{display: 'block', width: '100%'}} />
  </FieldWrapper>
);
