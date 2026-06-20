import {VisuallyHidden} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(VisuallyHidden, {
  fixtures: {
    default: {children: 'Loading results'},
    focusable: {children: 'Skip to main content', focusable: true},
  },
});
