import {StackedBarChart} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const DATA = [
  {month: 'Jan', a: 100, b: 50},
  {month: 'Feb', a: 140, b: 60},
  {month: 'Mar', a: 120, b: 80},
];
const SERIES = [
  {key: 'a', name: 'Series A'},
  {key: 'b', name: 'Series B'},
];

export default defineComponentFixtures(StackedBarChart, {
  fixtures: {
    withSeries: {data: DATA, xKey: 'month', series: SERIES},
  },
});
