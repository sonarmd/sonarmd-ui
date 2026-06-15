import {Checkbox} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Checkbox, {
  fixtures: {
    unchecked: {label: 'I agree to the terms'},
    checked: {label: 'I agree to the terms', defaultChecked: true},
  },
});
