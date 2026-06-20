import {useState} from 'react';
import type {Story} from '@ladle/react';
import {Drawer} from './index';
import {Button} from '../Button';

export default {
  title: 'Components/Drawer',
};

/** Slide-in side panel. Import: `import { Drawer } from '@sonarmd/ui'` */
export const Default: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Filters"
        footer={<Button onClick={() => setOpen(false)}>Apply</Button>}
      >
        <p>Filter controls go here.</p>
      </Drawer>
    </>
  );
};

export const LeftSide: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open navigation</Button>
      <Drawer open={open} onClose={() => setOpen(false)} side="left" title="Navigation">
        <p>Menu items go here.</p>
      </Drawer>
    </>
  );
};

export const BottomSheet: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <Drawer open={open} onClose={() => setOpen(false)} side="bottom" title="Details">
        <p>Bottom sheet content.</p>
      </Drawer>
    </>
  );
};
