import {Breadcrumbs} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(Breadcrumbs, {
  fixtures: {
    default: {
      items: [
        {label: 'Home', href: '/'},
        {label: 'Patients', href: '/patients'},
        {label: 'Detail'},
      ],
    },
    collapsed: {
      maxItems: 4,
      items: [
        {label: 'A', href: '/a'},
        {label: 'B', href: '/b'},
        {label: 'C', href: '/c'},
        {label: 'D', href: '/d'},
        {label: 'E', href: '/e'},
        {label: 'Now'},
      ],
    },
  },
});
