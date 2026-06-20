import {Drawer} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const noop = (): void => {};

export default defineComponentFixtures(Drawer, {
  portal: true,
  fixtures: {
    right: {open: true, title: 'Filters', onClose: noop, children: <p>Filter controls</p>},
    left: {open: true, side: 'left', title: 'Navigation', onClose: noop, children: <p>Menu</p>},
    closed: {open: false, title: 'Filters', onClose: noop, children: <p>Content</p>},
  },
});
