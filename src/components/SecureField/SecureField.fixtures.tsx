import {SecureField} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(SecureField, {
  fixtures: {
    masked: {name: 'ssn', label: 'Social Security Number', placeholder: '000-00-0000'},
    error: {name: 'mrn', label: 'MRN', error: 'Required', revealable: false},
  },
});
