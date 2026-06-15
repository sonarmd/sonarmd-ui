import React from 'react';
import type {Story} from '@ladle/react';
import {PageSection} from './index';
import {Button} from '../Button';

export const Default: Story = () => (
  <PageSection title="Demographics">
    <p style={{color: 'var(--smd-text-secondary)'}}>Patient demographic information.</p>
  </PageSection>
);

export const WithSubtitle: Story = () => (
  <PageSection title="HCC Risk Summary" subtitle="Based on claims data from the last 12 months">
    <p style={{color: 'var(--smd-text-secondary)'}}>Risk score details here.</p>
  </PageSection>
);

export const WithAction: Story = () => (
  <PageSection
    title="Care Gaps"
    action={<Button variant="ghost" size="sm">View all</Button>}
  >
    <p style={{color: 'var(--smd-text-secondary)'}}>Gap content here.</p>
  </PageSection>
);
