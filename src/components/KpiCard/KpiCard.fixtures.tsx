import {KpiCard} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(KpiCard, {
  fixtures: {
    basic: {title: 'Revenue', value: '$42,000'},
    trendUp: {
      title: 'Active users',
      value: 1234,
      trend: {direction: 'up', value: '+12%', sentiment: 'positive'},
    },
    loading: {title: 'Revenue', value: '-', isLoading: true},
  },
});
