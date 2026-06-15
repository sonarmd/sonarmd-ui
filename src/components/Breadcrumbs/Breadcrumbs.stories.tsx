import React from 'react';
import type {Story} from '@ladle/react';
import {Breadcrumbs} from './index';
import type {BreadcrumbItem} from './index';

const items: BreadcrumbItem[] = [
  {label: 'Home', href: '/'},
  {label: 'Patients', href: '/patients'},
  {label: 'J. Smith'},
];

export const Default: Story = () => (
  <Breadcrumbs items={items} />
);

export const WithCustomRenderer: Story = () => (
  <Breadcrumbs
    items={items}
    renderLink={(item) => (
      <a href={item.href} style={{color: 'var(--smd-text-primary)'}}>
        {item.label}
      </a>
    )}
  />
);

export const LongPath: Story = () => (
  <Breadcrumbs
    items={[
      {label: 'Home', href: '/'},
      {label: 'Admin', href: '/admin'},
      {label: 'Settings', href: '/admin/settings'},
      {label: 'Integrations', href: '/admin/settings/integrations'},
      {label: 'FHIR', href: '/admin/settings/integrations/fhir'},
      {label: 'R4 Endpoint'},
    ]}
  />
);
