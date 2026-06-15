import {PageSection} from './index';
import {defineComponentFixtures} from '../../testing/defineComponentFixtures';

export default defineComponentFixtures(PageSection, {
  fixtures: {
    titleChildren: {
      title: 'Overview',
      subtitle: 'Key performance indicators',
      children: <p>Section content here.</p>,
    },
  },
});
