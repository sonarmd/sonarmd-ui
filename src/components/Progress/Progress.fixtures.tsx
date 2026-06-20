import {Progress} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Progress, {
  fixtures: {
    default: {value: 64, label: 'Uploading report'},
    withValue: {value: 40, label: 'Syncing', showValue: true},
    success: {value: 100, tone: 'success', label: 'Complete'},
    indeterminate: {label: 'Loading'},
  },
});
