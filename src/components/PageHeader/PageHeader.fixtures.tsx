import {PageHeader} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(PageHeader, {
  router: true,
  fixtures: {
    titleSubtitle: {title: 'Analytics Dashboard', subtitle: 'Monitor your key metrics'},
    backLink: {title: 'Report Detail', backTo: '/reports', backLabel: 'Reports'},
  },
});
