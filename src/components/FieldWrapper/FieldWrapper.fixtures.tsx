import {FieldWrapper} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(FieldWrapper, {
  fixtures: {
    withLabel: {label: 'Email', htmlFor: 'email', children: <input id="email" type="text" />},
  },
});
