import {Skeleton} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Skeleton, {
  fixtures: {
    text: {variant: 'text', width: 200, height: 16},
    circle: {variant: 'circle', width: 40, height: 40},
    multiLine: {variant: 'text', lines: 3},
  },
});
