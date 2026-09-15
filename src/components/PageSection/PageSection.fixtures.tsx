import {PageSection} from './PageSection';
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
