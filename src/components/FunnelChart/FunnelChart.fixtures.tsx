import {FunnelChart} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(FunnelChart, {
  fixtures: {
    stages: {
      stages: [
        {name: 'Visited', value: 1000},
        {name: 'Signed up', value: 500},
        {name: 'Activated', value: 200},
      ],
    },
  },
});
