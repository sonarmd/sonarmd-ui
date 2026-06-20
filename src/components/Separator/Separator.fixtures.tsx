import {Separator} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Separator, {
  fixtures: {
    default: {},
    semantic: {decorative: false},
    vertical: {orientation: 'vertical', decorative: false},
    labeled: {label: 'OR'},
  },
});
