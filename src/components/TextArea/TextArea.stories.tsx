import React from 'react';
import type {Story} from '@ladle/react';
import {TextArea} from './index';

export const Default: Story = () => <TextArea label="Clinical Notes" />;

export const AutoResize: Story = () => (
  <TextArea label="Notes" autoResize minRows={3} maxRows={10} hint="Expands as you type." />
);

export const WithError: Story = () => (
  <TextArea label="Reason for Visit" error="This field is required." required />
);

export const Disabled: Story = () => (
  <TextArea label="Archived Notes" defaultValue="This patient was discharged on..." disabled />
);
