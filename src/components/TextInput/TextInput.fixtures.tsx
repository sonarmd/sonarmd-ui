import {TextInput} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(TextInput, {
  fixtures: {
    default: {name: 'email', placeholder: 'Enter email'},
    error: {name: 'email', label: 'Email', error: 'Required'},
  },
});
