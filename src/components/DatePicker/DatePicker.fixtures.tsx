import {DatePicker} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const noop = (): void => {};

export default defineComponentFixtures(DatePicker, {
  fixtures: {
    noValue: {value: null, onChange: noop, label: 'Date'},
  },
});
