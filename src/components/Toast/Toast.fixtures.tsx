import {ToastProvider} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(ToastProvider, {
  fixtures: {
    withChildren: {children: <div data-testid="app">Application content</div>},
  },
});
