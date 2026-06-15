import React from 'react';
import type {Story} from '@ladle/react';
import {GapsBanner} from './index';

export const Info: Story = () => (
  <GapsBanner title="3 care gaps identified" description="Patient has unaddressed HCC coding opportunities." />
);

export const Warning: Story = () => (
  <GapsBanner
    variant="warning"
    title="Annual wellness visit overdue"
    description="Last visit was over 14 months ago."
    action={{label: 'Schedule now', onClick: () => {}}}
  />
);

export const Success: Story = () => (
  <GapsBanner variant="success" title="All gaps addressed" description="No outstanding care gaps for this patient." />
);

export const Dismissible: Story = () => (
  <GapsBanner
    title="4 coding gaps found"
    description="Review and document before the encounter closes."
    dismissible
    onDismiss={() => {}}
    action={{label: 'Review gaps', onClick: () => {}}}
  />
);
