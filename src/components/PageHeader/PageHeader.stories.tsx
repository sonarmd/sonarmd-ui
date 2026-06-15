import React from 'react';
import type {Story} from '@ladle/react';
import {PageHeader} from './index';
import {Button} from '../Button';

export const Default: Story = () => (
  <PageHeader title="Patient List" />
);

export const WithSubtitle: Story = () => (
  <PageHeader title="J. Smith" subtitle="DOB: 1952-03-14 | MRN: 001234" />
);

export const WithActions: Story = () => (
  <PageHeader
    title="HCC Dashboard"
    subtitle="Q2 2026"
    actions={
      <>
        <Button variant="ghost">Export</Button>
        <Button variant="primary">Add Patient</Button>
      </>
    }
  />
);

export const WithBackLink: Story = () => (
  <PageHeader
    title="Patient Detail"
    backTo="/patients"
    backLabel="All Patients"
    breadcrumbs={[{label: 'Home', to: '/'}, {label: 'Patients', to: '/patients'}, {label: 'J. Smith'}]}
  />
);
