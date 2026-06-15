import React, {useState} from 'react';
import type {Story} from '@ladle/react';
import {AppErrorBoundary} from './index';

export default {
  title: 'Architecture/AppErrorBoundary',
};

function BombButton(): JSX.Element {
  const [boom, setBoom] = useState(false);
  if (boom) throw new Error('User triggered error');
  return (
    <button type="button" onClick={() => setBoom(true)}>
      Throw error
    </button>
  );
}

/** Full-page error boundary. Import: `import { AppErrorBoundary } from '@sonarmd/ui'` */
export const Default: Story = () => (
  <AppErrorBoundary>
    <p>App is healthy. Click the button to trigger an error:</p>
    <BombButton />
  </AppErrorBoundary>
);

export const ShowDetail: Story = () => (
  <AppErrorBoundary showDetail>
    <p>Internal tool - showDetail=true renders the raw error message.</p>
    <BombButton />
  </AppErrorBoundary>
);
