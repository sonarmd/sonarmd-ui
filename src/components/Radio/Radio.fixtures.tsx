import {Radio} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Radio, {
  fixtures: {
    unchecked: {label: 'Option A', name: 'choice', value: 'a'},
  },
});
