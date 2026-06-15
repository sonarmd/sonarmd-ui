import {BarChart} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const DATA = [
  {month: 'Jan', a: 100, b: 50},
  {month: 'Feb', a: 140, b: 60},
  {month: 'Mar', a: 120, b: 80},
];

export default defineComponentFixtures(BarChart, {
  fixtures: {
    withData: {data: DATA, xKey: 'month', yKey: 'a'},
  },
});
