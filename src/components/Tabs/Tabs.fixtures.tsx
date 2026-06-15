import {Tabs} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const noop = (): void => {};

export default defineComponentFixtures(Tabs, {
  fixtures: {
    underline: {
      tabs: [
        {key: 'overview', label: 'Overview'},
        {key: 'details', label: 'Details'},
        {key: 'history', label: 'History'},
      ],
      activeTab: 'overview',
      onChange: noop,
    },
    pills: {
      tabs: [
        {key: 'week', label: 'Week'},
        {key: 'month', label: 'Month'},
        {key: 'year', label: 'Year'},
      ],
      activeTab: 'month',
      onChange: noop,
      variant: 'pills',
    },
  },
});
