import {GaugeChart} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(GaugeChart, {
  fixtures: {
    atValue: {value: 75, label: 'Performance'},
  },
});
