import {DateRangePicker} from './DateRangePicker';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const noop = (): void => {};

export default defineComponentFixtures(DateRangePicker, {
  fixtures: {
    noValue: {value: undefined, onChange: noop, label: 'Date range'},
  },
});
