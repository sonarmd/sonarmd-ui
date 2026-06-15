import {TextArea} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(TextArea, {
  fixtures: {
    default: {name: 'notes', placeholder: 'Enter notes'},
  },
});
