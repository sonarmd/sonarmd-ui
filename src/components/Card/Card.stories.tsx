import type {Story} from '@ladle/react';
import {Card} from './index';

export default {
  title: 'Components/Card',
};

/** Content container with optional title. Import: `import { Card } from '@sonarmd/ui'` */
export const Default: Story = () => (
  <Card>
    <p>Card content goes here.</p>
  </Card>
);

export const WithTitle: Story = () => (
  <Card title="Patient Overview">
    <p>Chart notes, vitals, or any content.</p>
  </Card>
);

export const WithSubtitle: Story = () => (
  <Card title="Review Required" subtitle="3 items need attention">
    <p>Flagged for clinical review.</p>
  </Card>
);

export const Elevated: Story = () => (
  <Card title="Elevated Card" variant="elevated">
    <p>Elevated variant for prominent content.</p>
  </Card>
);
