import React from 'react';
import type {Story} from '@ladle/react';
import {FormActions} from '../components/FormActions/FormActions';
import {Button} from '../components/Button/Button';

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
