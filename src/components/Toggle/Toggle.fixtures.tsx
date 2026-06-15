import {Toggle} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const noop = (): void => {};

export default defineComponentFixtures(Toggle, {
  fixtures: {
    off: {label: 'Dark mode', checked: false, onChange: noop},
    on: {label: 'Dark mode', checked: true, onChange: noop},
  },
});
