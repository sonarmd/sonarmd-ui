import {KpiGrid} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(KpiGrid, {
  fixtures: {
    fourCol: {
      columns: 4,
      items: [
        {title: 'Revenue', value: '$42K'},
        {title: 'Users', value: '1,234'},
        {title: 'Conversion', value: '3.4%'},
        {title: 'Churn', value: '0.8%'},
      ],
    },
  },
});
