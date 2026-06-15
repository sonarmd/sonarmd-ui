import type {Story} from '@ladle/react';
import {Alert} from './index';

export default {
  title: 'Components/Alert',
};

/** Inline status message. Import: `import { Alert } from '@sonarmd/ui'` */
export const Default: Story = () => <Alert variant="info" title="Note">Review due in 3 days.</Alert>;

export const Variants: Story = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
    <Alert variant="info" title="Info">Scheduled maintenance tonight.</Alert>
    <Alert variant="success" title="Saved">Patient record updated.</Alert>
    <Alert variant="warning" title="Warning">Lab result pending review.</Alert>
    <Alert variant="error" title="Error">Could not save. Please retry.</Alert>
  </div>
);

export const Dismissible: Story = () => (
  <Alert variant="info" title="Dismissible" dismissible>This alert can be dismissed.</Alert>
);
