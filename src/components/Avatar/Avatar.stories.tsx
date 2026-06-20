import type {Story} from '@ladle/react';
import {Avatar} from './index';

export default {
  title: 'Components/Avatar',
};

/** Initials are derived from `name`. Import: `import { Avatar } from '@sonarmd/ui'` */
export const Default: Story = () => <Avatar name="Ada Lovelace" />;

export const Sizes: Story = () => (
  <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
    <Avatar name="Ada Lovelace" size="xs" />
    <Avatar name="Ada Lovelace" size="sm" />
    <Avatar name="Ada Lovelace" size="md" />
    <Avatar name="Ada Lovelace" size="lg" />
    <Avatar name="Ada Lovelace" size="xl" />
  </div>
);

export const WithStatus: Story = () => (
  <div style={{display: 'flex', gap: 12}}>
    <Avatar name="Grace Hopper" status="online" />
    <Avatar name="Alan Turing" status="busy" />
    <Avatar name="Edsger Dijkstra" status="away" />
    <Avatar name="Donald Knuth" status="offline" />
  </div>
);

export const ShapesAndFallback: Story = () => (
  <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
    <Avatar name="Katherine Johnson" shape="square" size="lg" />
    <Avatar size="lg" />
  </div>
);
