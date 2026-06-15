import {MultiSelect} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const OPTIONS = [
  {label: 'Option A', value: 'a'},
  {label: 'Option B', value: 'b'},
];
const noop = (): void => {};

export default defineComponentFixtures(MultiSelect, {
  fixtures: {
    noSelection: {label: 'Tags', options: OPTIONS, value: [], onChange: noop, placeholder: 'Select tags...'},
    selections: {options: OPTIONS, value: ['a', 'b'], onChange: noop},
  },
});
