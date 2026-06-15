import {BubbleChart} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(BubbleChart, {
  fixtures: {
    points: {
      data: [
        {name: 'A', x: 10, y: 20, size: 5},
        {name: 'B', x: 30, y: 15, size: 10},
      ],
    },
  },
});
