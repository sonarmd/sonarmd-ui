import {defineComponentFixtures} from '../../testing/defineComponentFixtures';
import {WidgetErrorBoundary} from './WidgetErrorBoundary';

export default defineComponentFixtures(WidgetErrorBoundary, {
  fixtures: {
    default: {
      children: 'Widget content',
    },
  },
  skipAxe: [],
});
