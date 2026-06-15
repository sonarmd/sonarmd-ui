import {Sidebar} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

const noop = (): void => {};
const ITEMS = [
  {key: 'dashboard', label: 'Dashboard', to: '/'},
  {key: 'analytics', label: 'Analytics', to: '/analytics'},
  {key: 'settings', label: 'Settings', to: '/settings'},
];

export default defineComponentFixtures(Sidebar, {
  router: true,
  fixtures: {
    navItems: {items: ITEMS, activeKey: 'dashboard', onNavigate: noop},
    collapsed: {items: ITEMS, activeKey: 'analytics', onNavigate: noop, collapsed: true},
  },
});
