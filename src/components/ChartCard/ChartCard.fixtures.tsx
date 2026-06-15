import {ChartCard} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(ChartCard, {
  fixtures: {
    content: {title: 'Revenue Over Time', subtitle: 'Last 30 days', children: <div data-testid="chart-stub" />},
    loading: {title: 'Revenue', isLoading: true, children: <div />},
    empty: {title: 'Revenue', isEmpty: true, emptyMessage: 'No data for this period', children: <div />},
  },
});
