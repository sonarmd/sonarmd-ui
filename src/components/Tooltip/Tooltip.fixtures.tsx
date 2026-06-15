import {Tooltip} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Tooltip, {
  fixtures: {
    trigger: {
      content: 'Helpful tip',
      placement: 'top',
      children: <button type="button">Hover me</button>,
    },
  },
});
