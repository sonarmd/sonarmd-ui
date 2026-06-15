import {PieChart} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const DATA = [
  {name: 'Category A', value: 60},
  {name: 'Category B', value: 40},
];

export default defineComponentFixtures(PieChart, {
  fixtures: {
    pie: {data: DATA},
    donut: {donut: true, data: DATA},
  },
});
