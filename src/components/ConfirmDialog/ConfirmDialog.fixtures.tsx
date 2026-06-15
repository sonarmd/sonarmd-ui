import {ConfirmDialog} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const noop = (): void => {};

export default defineComponentFixtures(ConfirmDialog, {
  portal: true,
  fixtures: {
    open: {
      open: true,
      title: 'Delete item?',
      message: 'This action cannot be undone.',
      onConfirm: noop,
      onCancel: noop,
    },
    danger: {
      open: true,
      title: 'Delete account?',
      message: 'All data will be permanently removed.',
      variant: 'danger',
      confirmLabel: 'Delete',
      onConfirm: noop,
      onCancel: noop,
    },
  },
});
