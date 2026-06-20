import type {Story} from '@ladle/react';
import {Progress} from './index';

export default {
  title: 'Components/Progress',
};

/** Determinate bar. Import: `import { Progress } from '@sonarmd/ui'` */
export const Default: Story = () => (
  <div style={{width: 320}}>
    <Progress value={64} label="Uploading report" />
  </div>
);

export const WithValue: Story = () => (
  <div style={{width: 320}}>
    <Progress value={40} label="Syncing" showValue />
  </div>
);

export const Tones: Story = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 12, width: 320}}>
    <Progress value={70} tone="primary" label="Primary" />
    <Progress value={100} tone="success" label="Success" />
    <Progress value={55} tone="warning" label="Warning" />
    <Progress value={30} tone="danger" label="Danger" />
  </div>
);

export const Indeterminate: Story = () => (
  <div style={{width: 320}}>
    <Progress label="Loading" />
  </div>
);
