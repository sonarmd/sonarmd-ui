import {Alert} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Alert, {
  fixtures: {
    info: {variant: 'info', children: 'This is an informational message.'},
    errorWithTitle: {variant: 'error', title: 'Something went wrong', children: 'Please try again later.'},
  },
});
