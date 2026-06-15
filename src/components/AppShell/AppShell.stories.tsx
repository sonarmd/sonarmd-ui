import type {Story} from '@ladle/react';
import {AppShell} from './index';

export default {
  title: 'Layout/AppShell',
};

const Nav = (): JSX.Element => (
  <div style={{padding: '16px 12px', height: '100%', background: 'var(--smd-bg-subtle, #f5f5fa)'}}>
    <strong>Nav</strong>
    <p style={{fontSize: 12}}>Sidebar content</p>
  </div>
);

/** 3-column layout shell. Import: `import { AppShell } from '@sonarmd/ui'` */
export const Default: Story = () => (
  <div style={{height: 400}}>
    <AppShell sidebar={<Nav />}>
      <div style={{padding: 24}}>
        <h2 style={{margin: 0}}>Main Content</h2>
      </div>
    </AppShell>
  </div>
);

export const WithContextRail: Story = () => (
  <div style={{height: 400}}>
    <AppShell
      sidebar={<Nav />}
      contextRail={<div style={{padding: 16, fontSize: 12}}>Context Rail</div>}
    >
      <div style={{padding: 24}}>
        <h2 style={{margin: 0}}>Content</h2>
      </div>
    </AppShell>
  </div>
);
