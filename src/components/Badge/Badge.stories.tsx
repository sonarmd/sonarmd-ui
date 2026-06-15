import type {Story} from '@ladle/react';
import {Badge} from './index';

export default {
  title: 'Components/Badge',
};

/** Default neutral badge. Import: `import { Badge } from '@sonarmd/ui'` */
export const Default: Story = () => <Badge>Active</Badge>;

export const Variants: Story = () => (
  <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
    <Badge variant="primary">Primary</Badge>
    <Badge variant="success">Success</Badge>
    <Badge variant="warning">Warning</Badge>
    <Badge variant="danger">Danger</Badge>
    <Badge variant="neutral">Neutral</Badge>
    <Badge variant="cyan">Cyan</Badge>
    <Badge variant="magenta">Magenta</Badge>
  </div>
);

export const WithDot: Story = () => (
  <div style={{display: 'flex', gap: 8}}>
    <Badge dot variant="success">Online</Badge>
    <Badge dot variant="danger">Error</Badge>
    <Badge dot variant="warning">Degraded</Badge>
  </div>
);

export const Sizes: Story = () => (
  <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
    <Badge size="sm">Small</Badge>
    <Badge size="md">Medium</Badge>
  </div>
);
