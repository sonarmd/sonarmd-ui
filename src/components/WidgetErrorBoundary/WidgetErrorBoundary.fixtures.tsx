import {defineComponentFixtures} from '../../testing/defineComponentFixtures';
import {WidgetErrorBoundary} from './index';

export default defineComponentFixtures(WidgetErrorBoundary, {
  fixtures: {
    default: {
      children: 'Widget content',
    },
  },
  skipAxe: [],
});
