import {Select} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const OPTIONS = [
  {label: 'Option A', value: 'a'},
  {label: 'Option B', value: 'b'},
];

export default defineComponentFixtures(Select, {
  fixtures: {
    withOptions: {name: 'size', label: 'Size', options: OPTIONS, placeholder: 'Choose...'},
  },
});
