import {Card} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Card, {
  fixtures: {
    withHeader: {title: 'Revenue', subtitle: 'Last 30 days', children: <p>Body</p>},
    elevated: {variant: 'elevated', density: 'compact', children: <p>Body</p>},
  },
});
