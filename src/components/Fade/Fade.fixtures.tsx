import {Fade} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Fade, {
  fixtures: {
    children: {delay: 60, children: <p>Loaded</p>},
  },
});
