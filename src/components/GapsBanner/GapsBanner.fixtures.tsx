import {GapsBanner} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const noop = (): void => {};

export default defineComponentFixtures(GapsBanner, {
  fixtures: {
    info: {title: 'Update available', description: 'A new version is ready to install.', variant: 'info'},
    warningAction: {
      title: 'Maintenance scheduled',
      description: 'Downtime expected at 2 AM UTC.',
      variant: 'warning',
      action: {label: 'View details', onClick: noop},
      dismissible: true,
      onDismiss: noop,
    },
  },
});
