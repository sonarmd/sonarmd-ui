import type {Story} from '@ladle/react';
import {Accordion} from './index';

export default {
  title: 'Components/Accordion',
};

const items = [
  {key: 'eligibility', title: 'Eligibility', content: 'Coverage active through 2026.'},
  {key: 'history', title: 'Care history', content: 'Last visit 2026-05-02.'},
  {key: 'consent', title: 'Consent', content: 'Signed 2026-01-14.'},
];

/** Single-open disclosure set. Import: `import { Accordion } from '@sonarmd/ui'` */
export const Default: Story = () => (
  <div style={{width: 360}}>
    <Accordion items={items} defaultExpandedKeys={['eligibility']} />
  </div>
);

export const Multiple: Story = () => (
  <div style={{width: 360}}>
    <Accordion items={items} type="multiple" defaultExpandedKeys={['eligibility', 'history']} />
  </div>
);

export const WithDisabled: Story = () => (
  <div style={{width: 360}}>
    <Accordion
      items={[...items, {key: 'billing', title: 'Billing (locked)', content: 'n/a', disabled: true}]}
    />
  </div>
);
