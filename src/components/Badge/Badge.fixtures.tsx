import {Badge} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Badge, {
  fixtures: {
    default: {children: 'Active', variant: 'primary'},
    success: {children: 'Synced', variant: 'success'},
    danger: {children: 'Overdue', variant: 'danger'},
  },
});
