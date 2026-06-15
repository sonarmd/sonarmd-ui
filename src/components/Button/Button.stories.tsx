import type {Story} from '@ladle/react';
import {Button} from './index';

export default {
  title: 'Components/Button',
};

/** Primary action button. Import: `import { Button } from '@sonarmd/ui'` */
export const Default: Story = () => <Button variant="primary">Save</Button>;

export const Variants: Story = () => (
  <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
  </div>
);

export const Sizes: Story = () => (
  <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
    <Button variant="primary" size="sm">Small</Button>
    <Button variant="primary" size="md">Medium</Button>
    <Button variant="primary" size="lg">Large</Button>
  </div>
);

export const Loading: Story = () => (
  <div style={{display: 'flex', gap: 8}}>
    <Button variant="primary" loading>Saving...</Button>
    <Button variant="secondary" loading>Loading</Button>
  </div>
);

export const Disabled: Story = () => (
  <div style={{display: 'flex', gap: 8}}>
    <Button variant="primary" disabled>Disabled</Button>
    <Button variant="secondary" disabled>Disabled</Button>
  </div>
);
