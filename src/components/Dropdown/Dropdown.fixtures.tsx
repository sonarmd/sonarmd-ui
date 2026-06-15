import {Dropdown} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const OPTIONS = [
  {label: 'Option A', value: 'a'},
  {label: 'Option B', value: 'b'},
];
const noop = (): void => {};

export default defineComponentFixtures(Dropdown, {
  fixtures: {
    closed: {label: 'Category', options: OPTIONS, value: null, onChange: noop, placeholder: 'Select...'},
    selected: {options: OPTIONS, value: 'a', onChange: noop},
  },
});
