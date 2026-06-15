import React from 'react';
import type {Story} from '@ladle/react';
import {FormActions} from './index';
import {Button} from '../Button';

export const Default: Story = () => (
  <FormActions>
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Save</Button>
  </FormActions>
);

export const AlignLeft: Story = () => (
  <FormActions align="start">
    <Button variant="primary">Save</Button>
    <Button variant="ghost">Discard</Button>
  </FormActions>
);

export const WithDestructive: Story = () => (
  <FormActions>
    <Button variant="danger">Delete Record</Button>
    <div style={{flex: 1}} />
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Save</Button>
  </FormActions>
);
