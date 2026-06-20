import {Avatar} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Avatar, {
  fixtures: {
    initials: {name: 'Ada Lovelace'},
    withStatus: {name: 'Grace Hopper', status: 'online'},
    square: {name: 'Katherine Johnson', shape: 'square', size: 'lg'},
    empty: {size: 'sm'},
  },
});
