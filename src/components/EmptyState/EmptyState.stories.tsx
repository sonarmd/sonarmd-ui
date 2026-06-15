import React from 'react';
import type {Story} from '@ladle/react';
import {EmptyState} from './index';

export const Default: Story = () => (
  <EmptyState title="No patients found" />
);

export const WithDescription: Story = () => (
  <EmptyState
    title="No care gaps"
    description="All identified gaps have been addressed or are in progress."
  />
);

export const WithAction: Story = () => (
  <EmptyState
    title="No patients match your filters"
    description="Try adjusting your search criteria."
    action={{label: 'Clear filters', onClick: () => {}}}
  />
);

export const WithIcon: Story = () => (
  <EmptyState
    title="No alerts"
    description="You have no pending clinical alerts."
    icon={
      <svg viewBox="0 0 24 24" width={48} height={48} fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    }
  />
);
