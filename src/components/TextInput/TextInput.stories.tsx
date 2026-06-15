import React from 'react';
import type {Story} from '@ladle/react';
import {TextInput} from './index';

export const Default: Story = () => <TextInput label="First Name" />;

export const Sizes: Story = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
    <TextInput label="Small" size="sm" />
    <TextInput label="Medium (default)" size="md" />
    <TextInput label="Large" size="lg" />
  </div>
);

export const WithHintAndError: Story = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
    <TextInput label="Email" type="email" hint="We'll never share your address." />
    <TextInput label="Email" type="email" error="Please enter a valid email address." />
  </div>
);

export const Required: Story = () => <TextInput label="MRN" required placeholder="000000" />;

export const WithIcons: Story = () => (
  <TextInput
    label="Search"
    placeholder="Search patients..."
    iconLeft={
      <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx={7} cy={7} r={5} />
        <path d="M11 11l3 3" strokeLinecap="round" />
      </svg>
    }
  />
);
