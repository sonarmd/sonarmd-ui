import {SegmentedControl} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const noop = (): void => {};
const views = [
  {value: 'list', label: 'List'},
  {value: 'grid', label: 'Grid'},
  {value: 'board', label: 'Board'},
];

export default defineComponentFixtures(SegmentedControl, {
  fixtures: {
    default: {options: views, value: 'list', onChange: noop, ariaLabel: 'View mode'},
    fullWidth: {options: views, value: 'grid', onChange: noop, fullWidth: true, ariaLabel: 'View mode'},
    small: {options: views, value: 'board', onChange: noop, size: 'sm', ariaLabel: 'View mode'},
  },
});
