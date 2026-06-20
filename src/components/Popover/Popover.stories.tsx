import type {Story} from '@ladle/react';
import {Popover} from './index';
import {Button} from '../Button';

export default {
  title: 'Components/Popover',
};

/** Anchored interactive content. Import: `import { Popover } from '@sonarmd/ui'` */
export const Default: Story = () => (
  <Popover trigger={<Button>Actions</Button>} ariaLabel="Quick actions">
    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
      <Button variant="ghost" size="sm">Edit</Button>
      <Button variant="ghost" size="sm">Duplicate</Button>
      <Button variant="ghost" size="sm">Archive</Button>
    </div>
  </Popover>
);

export const EndAligned: Story = () => (
  <div style={{display: 'flex', justifyContent: 'flex-end'}}>
    <Popover
      trigger={<Button>Menu</Button>}
      placement="bottom-end"
      ariaLabel="Menu"
    >
      <p style={{margin: 0}}>Aligned to the trigger end.</p>
    </Popover>
  </div>
);

export const TopPlacement: Story = () => (
  <div style={{marginTop: 200}}>
    <Popover trigger={<Button>Info</Button>} placement="top" ariaLabel="Info">
      <p style={{margin: 0}}>Opens above the trigger.</p>
    </Popover>
  </div>
);
