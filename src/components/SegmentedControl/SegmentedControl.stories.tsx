import {useState} from 'react';
import type {Story} from '@ladle/react';
import {SegmentedControl} from './index';

export default {
  title: 'Components/SegmentedControl',
};

const views = [
  {value: 'list', label: 'List'},
  {value: 'grid', label: 'Grid'},
  {value: 'board', label: 'Board'},
];

/** View-mode toggle. Import: `import { SegmentedControl } from '@sonarmd/ui'` */
export const Default: Story = () => {
  const [value, setValue] = useState('list');
  return <SegmentedControl options={views} value={value} onChange={setValue} ariaLabel="View mode" />;
};

export const FullWidth: Story = () => {
  const [value, setValue] = useState('day');
  return (
    <div style={{width: 360}}>
      <SegmentedControl
        options={[
          {value: 'day', label: 'Day'},
          {value: 'week', label: 'Week'},
          {value: 'month', label: 'Month'},
        ]}
        value={value}
        onChange={setValue}
        fullWidth
        ariaLabel="Range"
      />
    </div>
  );
};

export const Small: Story = () => {
  const [value, setValue] = useState('grid');
  return <SegmentedControl options={views} value={value} onChange={setValue} size="sm" ariaLabel="View mode" />;
};
