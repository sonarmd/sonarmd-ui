import {Modal} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const noop = (): void => {};

export default defineComponentFixtures(Modal, {
  portal: true,
  fixtures: {
    open: {open: true, title: 'Confirmation', onClose: noop, children: <p>Are you sure you want to proceed?</p>},
    closed: {open: false, title: 'Confirmation', onClose: noop, children: <p>Content</p>},
  },
});
