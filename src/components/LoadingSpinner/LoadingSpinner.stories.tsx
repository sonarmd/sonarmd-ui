import React from 'react';
import type {Story} from '@ladle/react';
import {LoadingSpinner} from './index';

export const Default: Story = () => <LoadingSpinner />;

export const Sizes: Story = () => (
  <div style={{display: 'flex', gap: 24, alignItems: 'center'}}>
    <LoadingSpinner size="sm" />
    <LoadingSpinner size="md" />
    <LoadingSpinner size="lg" />
  </div>
);

export const WithLabel: Story = () => (
  <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
    <LoadingSpinner />
    <span style={{color: 'var(--smd-text-secondary)'}}>Loading patients...</span>
  </div>
);

export const InContext: Story = () => (
  <div style={{padding: 48, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center'}}>
    <LoadingSpinner size="lg" />
    <span style={{color: 'var(--smd-text-secondary)'}}>Fetching patient records...</span>
  </div>
);
