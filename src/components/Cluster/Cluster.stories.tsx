import React from 'react';
import type {Story} from '@ladle/react';
import {Cluster} from './index';
import {Badge} from '../Badge';
import {Button} from '../Button';

export const Default: Story = () => (
  <Cluster gap="2">
    <Badge variant="neutral">HCC</Badge>
    <Badge variant="warning">Review</Badge>
    <Badge variant="danger">High Risk</Badge>
  </Cluster>
);

export const WithActions: Story = () => (
  <Cluster gap="2" justify="end">
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Save</Button>
  </Cluster>
);

export const WrappingContent: Story = () => (
  <div style={{width: 300}}>
    <Cluster gap="1" wrap>
      {['Diabetes', 'CHF', 'CKD', 'COPD', 'CAD', 'Hypertension', 'Obesity'].map((tag) => (
        <Badge key={tag} variant="neutral">{tag}</Badge>
      ))}
    </Cluster>
  </div>
);
