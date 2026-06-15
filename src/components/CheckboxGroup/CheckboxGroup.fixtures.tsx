import {CheckboxGroup} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const OPTIONS = [
  {label: 'Option A', value: 'a'},
  {label: 'Option B', value: 'b'},
];
const noop = (): void => {};

export default defineComponentFixtures(CheckboxGroup, {
  fixtures: {
    oneSelected: {label: 'Sizes', options: OPTIONS, value: ['a'], onChange: noop},
  },
});
