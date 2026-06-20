import type {Story} from '@ladle/react';
import {Separator} from './index';

export default {
  title: 'Components/Separator',
};

/** Horizontal divider. Import: `import { Separator } from '@sonarmd/ui'` */
export const Default: Story = () => (
  <div style={{width: 280}}>
    <p>Section one</p>
    <Separator />
    <p>Section two</p>
  </div>
);

export const Labeled: Story = () => (
  <div style={{width: 280}}>
    <Separator label="OR" />
  </div>
);

export const Vertical: Story = () => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, height: 32}}>
    <span>Edit</span>
    <Separator orientation="vertical" decorative={false} />
    <span>Duplicate</span>
    <Separator orientation="vertical" decorative={false} />
    <span>Delete</span>
  </div>
);
