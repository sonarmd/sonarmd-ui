import React from 'react';
import type {Story} from '@ladle/react';
import {SecureField} from './index';

export const Default: Story = () => <SecureField label="Medical Record Number (MRN)" />;

export const WithReveal: Story = () => (
  <SecureField label="SSN" revealable hint="Enter 9-digit Social Security Number." />
);

export const WithError: Story = () => (
  <SecureField label="MRN" error="MRN must be at least 6 characters." required />
);

export const NotRevealable: Story = () => (
  <SecureField label="API Key" revealable={false} hint="Contact your administrator to rotate." />
);
