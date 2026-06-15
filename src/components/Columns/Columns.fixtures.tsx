import {defineComponentFixtures} from '../../testing/defineComponentFixtures';
import {Columns} from './index';

const Box = ({label}: {label: string}) => (
  <div style={{padding: '8px', background: '#eee'}}>{label}</div>
);

export default defineComponentFixtures(Columns, {
  fixtures: {
    twoEqual: {
      cols: 2,
      children: [<Box key="1" label="Col 1" />, <Box key="2" label="Col 2" />],
    },
    threeEqual: {
      cols: 3,
      gap: '6',
      children: [<Box key="1" label="A" />, <Box key="2" label="B" />, <Box key="3" label="C" />],
    },
    template: {
      template: '2fr 1fr',
      children: [<Box key="1" label="Wide" />, <Box key="2" label="Narrow" />],
    },
  },
});
