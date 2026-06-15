import {defineComponentFixtures} from '../../testing/defineComponentFixtures';
import {Spacer} from './index';

export default defineComponentFixtures(Spacer, {
  fixtures: {
    fixed:      {size: '4'},
    flexGrow:   {},
    horizontal: {size: '6', axis: 'horizontal'},
  },
});
