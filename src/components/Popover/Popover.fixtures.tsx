import {Popover} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Popover, {
  portal: true,
  fixtures: {
    open: {
      open: true,
      ariaLabel: 'Quick actions',
      trigger: <button type="button">Actions</button>,
      children: <p>Popover content</p>,
    },
    closed: {
      open: false,
      trigger: <button type="button">Actions</button>,
      children: <p>Popover content</p>,
    },
  },
});
