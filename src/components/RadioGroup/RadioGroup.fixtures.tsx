import {RadioGroup} from './RadioGroup';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const OPTIONS = [
  {label: 'Option A', value: 'a'},
  {label: 'Option B', value: 'b'},
];
const noop = (): void => {};

export default defineComponentFixtures(RadioGroup, {
  fixtures: {
    withSelection: {label: 'Choice', name: 'choice', options: OPTIONS, value: 'a', onChange: noop},
  },
});
